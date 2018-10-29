#!/usr/bin/env /usr/local/bin/python
"""
Copyright (c) 2014-2015, Juniper Networks, Inc.
All rights reserved.
Author: Naran Babhu Kannan
Edited: Sumer Joshi
Description: Slipstream Export Using Maven
"""
import sys

if sys.hexversion < 0x02070000:
    print 'Error: Need python version 2.7 or greater to run jgit'
    sys.exit(1)

import argparse
import glob
import os
import re
import shutil
import shlex
import subprocess
import ConfigParser
import tarfile
from datetime import datetime
import requests
import logging

class Pipeline(object):
    """ Build CI Pipeline Class  """

    def __init__(self, options):
        self.opt = options
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        self.workspace = os.path.dirname(os.path.dirname(self.script_dir))
        os.chdir(self.workspace)
        config = ConfigParser.RawConfigParser()
        config.read('slipstream/scripts/build.cfg')
        self.mvn_repo = config.get('maven-repo', 'url')
        self.mvn_artifactId = config.get('maven-repo', 'artifactId')
        self.mvn_groupId = self.opt.branch_type
        self.art_url = 'http://ssd-tools6.juniper.net:8081/artifactory'
        self.enc_pw = config.get('artifactory', 'password')
        self.username = config.get('artifactory', 'username')

        mvn_path = "which mvn"
        process = subprocess.Popen(mvn_path, shell=True, stdout=subprocess.PIPE)
        output, err = process.communicate()
        self.mvn = output.rstrip()

        self.plugin_manager = self.script_dir + '/plugin_manager.sh'
        print 'Current Dir  %s' % (self.plugin_manager)

        if not os.path.isfile(self.mvn):
            print 'Error: Maven is not installed'
            sys.exit(1)

        """ Change HOME to avoid mounted loaction on build machine """
        os.environ["HOME"] = self.workspace
        """ Change maven repo location to keep it Slipstream specific """
        self.mvn = self.mvn + " -V -B "

    def precompile(self):
        """ Compilation step for Nodespog """
        print 'Current Dir  %s' % (self.workspace)

        os.chdir('%s/slipstream' % self.workspace)

        command = 'echo Building Type %s' % self.opt.type
        execute(command, self.opt.debug)

        command = 'npm install'
        execute(command, self.opt.debug)

        command = 'echo Git Hash is %s' % self.opt.git_commit
        execute(command, self.opt.debug)
        
        build_timestamp = datetime.now().strftime('%Y-%m-%d_%H.%M.%S_%p')
        command = 'echo Build Timestamp is %s' % build_timestamp
        execute(command, self.opt.debug)

        command = 'echo Build Number is %s' % self.opt.build_number
        execute(command, self.opt.debug)

        command = 'echo Build Version is %s' % self.opt.build_id
        execute(command, self.opt.debug)

        command = 'grunt createbldinfo --bldno=%s --bldhash=%s --bldtime=%s --bldversion=%s' % \
                  (self.opt.build_number, self.opt.git_commit, build_timestamp, self.opt.build_id)
        execute(command, self.opt.debug)

    def capture_sdk_packages(self):
        """Capture SDK Packages from Artifactory"""
        folder_paths = []
        scripts_dir = os.path.dirname(self.plugin_manager)
        for x in glob.glob('%s/dependency_modules/**' % scripts_dir):
            if os.path.isdir(x):
                folder_paths.append(x)

        for folder in folder_paths:
            module_folder = os.path.basename(str(folder))
            if 'centos' in module_folder.lower():
                extension = 'Slipstream_SDK_Packages/Linux/Centos'
                self._get_packages_by_ext(folder, extension)
                self.decompress(folder)
 
            elif 'osx' in module_folder.lower():
                extension = 'Slipstream_SDK_Packages/MacOS'
                self._get_packages_by_ext(folder, extension)
                self.decompress(folder)

            else:
                print "No OS matches any of these dependency folders"
                exit(1)


    def _get_packages_by_ext(self, folder, extension):
        api_call = '%s/api/storage/%s' % (self.art_url, extension)
        curl_link = '%s/%s' % (self.art_url, extension)
        os.chdir(folder)
        data = self.get_request(api_call)
        children = self.get_uri_info(data['children'])
        for child in children:
            download_link = '%s%s' % (curl_link, child)
            command = 'wget %s --user=%s --password=%s' % (download_link, self.username, self.enc_pw)
            execute(command, self.opt.debug)
            
    def decompress(self, folder):
        for file in os.listdir(folder):
            if bool(re.search(r'\d', file)):
                package_name = file.split('-')[0]
                if file.lower().endswith(('.tar.gz', '.gz', '.bz2')):
                    tarfile_x = tarfile.is_tarfile(file)
                    if not tarfile_x:
                        print "File %s is not a tarfile" % file
                        exit(1)
                    try:
                        command = 'tar xzf %s' % (file)
                        print "Untarring %s in %s" % (file, folder)
                        execute(command, self.opt.debug)
                    except IOError:
                        print "File: %s is corrupt." % file
                        exit(1)
                    self.rename_package(package_name, folder)
                    os.remove(file)
                else:
                    print "File %s is not a tar. Renaming to %s" % (file, package_name)
                    os.rename(file, package_name)
                    command = 'chmod +x %s' % (package_name)
                    execute(command, self.opt.debug)

    def get_request(self, path):
        data = None
        try:
            r = requests.get(path, auth=(self.username, self.enc_pw), verify=False)
        except requests.RequestException as e:
            logging.exception(e)
            print (e)
        else:
            if r.status_code == requests.codes.ok:
                try:
                    data = r.json()
                except ValueError as ve:
                    logging.exception(ve)
                    print (ve)
            else:
                logging.error('Response text:\n' + r.text)
                print ('ERROR: Response text:\n' + r.text)
        finally:
            return data

    def get_uri_info(self, data):
        uris = []
        for item in data:
            uris.append(item['uri'].encode("utf-8"))
        return uris
 
    def rename_package(self, package_name, folder):
        directories = os.walk(folder).next()[1]
        for dirname in directories:
            if package_name in dirname:
                try:
                    os.rename(dirname, package_name)
                except OSError, e:
                    print e
                    print "Cannot rename %s" % package_name
                    exit(1)
                else:
                    continue

    def compile(self):
        """ Compilation step for Slipstream """
        print 'Current Dir  %s' % (self.workspace)

        os.chdir('%s/slipstream' % self.workspace)

        command = 'grunt jenkins'
        execute(command, self.opt.debug)

    def copy(self):
        """ Copy step In GruntFile """
        print 'Current Dir  %s' % (self.workspace)
        os.chdir('%s/slipstream' % self.workspace)

        if self.opt.sdk_copy and self.opt.ui_copy:
            '''This copies everything, including the UI and SDK Files'''
            command = 'grunt copy'
        else:
            '''This copies just the basic files we need. No SDK Files here that are going to dist'''
            command = 'grunt jenkinsCopy'

        execute(command, self.opt.debug)


    def framework_server_functional_tests(self):
        """Framework Server Functional Tests"""
        print 'Current Dir  %s' % (self.workspace)

        os.chdir('%s/slipstream' % self.workspace)

        command = 'grunt mochaTest:ci-framework-server-functional-tests'
        execute(command, self.opt.debug)

    def framework_server_unit_tests(self):
        """Framework Server Unit Tests"""
        print 'Current Dir  %s' % (self.workspace)

        os.chdir('%s/slipstream' % self.workspace)

        command = 'grunt mochaTest:ci-framework-server-unit-tests'
        execute(command, self.opt.debug)

    def framework_client_unit_tests(self):
        """Framework Client Unit Tests"""
        print 'Current Dir  %s' % (self.workspace)

        os.chdir('%s/slipstream' % self.workspace)

        command = 'grunt ci-framework-client-unit-tests'
        execute(command, self.opt.debug)

    def set_up_directories(self, dir):
        try:
            os.makedirs(dir)
        except OSError:
            if not os.path.isdir(dir):
                raise
    
    def createSDK(self, fullVersion):
        """ Build SDK """
        sdk_dir = '/tmp/slipstream_sdk'
        self.set_up_directories('%s' % sdk_dir)
        self.capture_sdk_packages()        

        os.chdir('%s/slipstream' % self.workspace)

        command = 'grunt createSDK'
        execute(command, self.opt.debug)

    def createUI(self, fullVersion):
        """ Build UI"""
        os.chdir('%s/slipstream' % self.workspace)

        command = 'grunt createUI'
        execute(command, self.opt.debug)

    def createTarFramework(self, fullVersion):
        """ Build Tar of Slipstream Framework """        
        os.chdir('%s' % self.workspace)

        tar_dir = '/tmp/framework/'
        self.set_up_directories('%s' % tar_dir)

        command = 'tar -czf %s/Slipstream-%s.tar.gz slipstream' % (tar_dir, fullVersion)
        execute(command, self.opt.debug)

        tar_path_dir = os.path.join(tar_dir, 'Slipstream-' + fullVersion + '.tar.gz')
        return tar_path_dir
        
    def export(self):
        """ Export step """
        print 'Current Dir  %s' % (self.workspace)
        print 'Build number %s' % (self.opt.seq_no)
        fullVersion = '%s.%s-%s' % (self.opt.version, self.opt.release, self.opt.seq_no)

        ui_lite_path_dir = None
        sdk_centos_rpm_path_dir = None
        sdk_osx_rpm_path_dir = None

        """ Call Build SDK Step to Generate Slipstream SDK """
        if self.opt.sdk_export:
            self.createSDK(fullVersion)
            sdk_centos_rpm_path_dir = '/tmp/slipstream-rpms/rpms/SlipstreamSDK-CentOS-%s.x86_64.rpm' % (fullVersion)
            sdk_osx_rpm_path_dir = '/tmp/slipstream-rpms/rpms/SlipstreamSDK-OSX-%s.x86_64.rpm' % (fullVersion)

        tar_path_dir = self.createTarFramework(fullVersion)
        rpm_path_dir = '/tmp/slipstream-rpms/rpms/Slipstream-%s.x86_64.rpm' % (fullVersion)
        

        os.chdir('%s/slipstream/scripts' % self.workspace)

        """ Create .rpm """
        buildRpm('slipstream', self.opt.version, self.opt.release, self.opt.seq_no, self.opt.debug)

        if self.opt.ui_export:
            self.createUI(fullVersion)
            ui_lite_path_dir = '%s/slipstream/SlipstreamUI.tar' % (self.workspace)

        os.chdir('/tmp/')

        command = ''
        if self.opt.ui_export and self.opt.sdk_export:
            command = self.mvn + ' deploy:deploy-file \
                   -Durl=%s \
                   -Dfile=%s -DgroupId=%s -DartifactId=%s \
                   -Dversion=%s -Dfiles=%s,%s,%s,%s -Dclassifiers=main,buildWithoutNodeModules,linux,mac -Dtypes=tar.gz,tar,rpm,rpm' % (self.mvn_repo, rpm_path_dir, self.mvn_groupId, self.mvn_artifactId, fullVersion, tar_path_dir, ui_lite_path_dir, sdk_centos_rpm_path_dir, sdk_osx_rpm_path_dir)
        else:
            command = self.mvn + ' deploy:deploy-file \
                               -Durl=%s \
                               -Dfile=%s -DgroupId=%s -DartifactId=%s \
                               -Dversion=%s -Dfiles=%s -Dclassifiers=main -Dtypes=tar.gz' % \
                                 (self.mvn_repo, rpm_path_dir, self.mvn_groupId, self.mvn_artifactId, fullVersion,
                                  tar_path_dir)

        print command
        execute(command, self.opt.debug)

        """ Cleanup after Export """
        print 'Cleanup of Files from Local System'
        self.cleanup(tar_path_dir)
        self.cleanup(rpm_path_dir)

        if self.opt.ui_export and self.opt.sdk_export:
            self.cleanup(ui_lite_path_dir)
            self.cleanup(sdk_centos_rpm_path_dir)
            self.cleanup(sdk_osx_rpm_path_dir)

    def cleanup(self, path_to_file):
        print 'Cleanup of File %s from Local System' % (path_to_file)
        if os.path.isfile(path_to_file):
            os.remove(path_to_file)
            if os.path.exists(path_to_file):
                print 'ERROR! File Path %s Still Exists when it should not. Exiting...' % (path_to_file)
                exit(1)
            else:
                print 'File %s was deleted gracefully on local system' % (path_to_file)

    def export_widget(self):
        """ Exporting Widget """
        print 'Current Dir:  %s' % (self.workspace)
        print 'Build Number: %s' % (self.opt.build_number)
        print 'Build ID: %s' % (self.opt.build_id)
        print 'Slipstream Workspace: %s' % (self.opt.workspace_path)
        print 'Version: %d' % (self.opt.version)
        print 'ArtDir: %s' % (self.opt.artdir)
        print 'Type: %s' % (self.opt.type)
        fullVersion = '%s.%s-%s' % (self.opt.version, self.opt.release, self.opt.build_number)
        print fullVersion

        os.chdir('%s/slipstream/' % self.workspace)
        
        """ Build Widgets """
        command = './scripts/build/build-slipstream.sh --time %s --bldno %s --ws %s --ver %d --art %s --bldtyp %s' % \
		(self.opt.build_id, self.opt.build_number, self.opt.workspace_path, self.opt.version, self.opt.artdir, self.opt.type)
        execute(command, self.opt.debug)

        
        """ Upload Widgets """
        command = self.mvn + ' deploy:deploy-file \
                    -Durl=%s \
                    -Dfile=%s/%d.%s/slipstream_widgetlib.tar.gz  -DgroupId=widgets -DartifactId=slipstream_widgetlib \
                    -Dversion=%s -DgeneratePom=false' % (self.mvn_repo, self.opt.artdir, self.opt.version, self.opt.build_number, fullVersion)
        execute(command, self.opt.debug)


def buildRpm(appname, version, release, seq_no, debug):
    """ Function to build app rpm """
    command = './buildAppsRpms.sh \
                -appname %s \
                -buildroot /tmp/slipstream-rpms \
                -version %s \
                -release %s \
                -vcsno %s' % (appname, version, release, seq_no)
    execute(command, debug)


def execute(command, debug):
    """ Function to execute shell command and return the output """

    if debug:
        print 'DEBUG: %s' % (command)
    pipe = subprocess.Popen(shlex.split(command),
                            stdout=subprocess.PIPE,
                            stderr=subprocess.STDOUT,
                            close_fds=True)

    for line in iter(pipe.stdout.readline, b''):
        print line.rstrip()
    rc = pipe.wait()

    if rc:
        print 'Error: Working directory: %s' % (os.getcwd())
        print 'Error: Failed to execute command: %s' % (command,)
        sys.exit(1)


def parse_options(args):
    """ Parse command line arguments """
    parser = argparse.ArgumentParser(description='Slipstream Product Pipeline Script')
    parser.add_argument('-v', dest='debug', action='store_true', help='Enable verbose mode')
    parser.add_argument('-x', dest='branch_type', type=str, required=False, help='branch value given by Jenkins')   

    subparsers = parser.add_subparsers(title='Pipeline sub-commands',
                                       description='Select one sub-command',
                                       dest='command')

    parser_precompile = subparsers.add_parser('precompile', description='Compilation step for Nodespog')
    parser_precompile.add_argument('-t', dest='type', type=str, required=True, help='$type variable from Jenkins')
    parser_precompile.add_argument('-c', dest='git_commit', type=str, required=True, help='Git Commit from Jenkins')
    parser_precompile.add_argument('-i', dest='build_id', type=str, required=True, help='Build Timestamp from Jenkins')
    parser_precompile.add_argument('-b', dest='build_number', type=str, required=True, help='Build Number from Jenkins')

    parser_compile = subparsers.add_parser('compile', description='Compilation step for Slipstream')

    parser_copy = subparsers.add_parser('copy', description='Grunt Copy Step of Build')
    parser_copy.add_argument('-s', dest='sdk_copy', action='store_true', required=False, help='boolean used to copy sdk')
    parser_copy.add_argument('-u', dest='ui_copy', action='store_true', required=False, help='boolean used to copy ui')

    parser_framework_server_functional_tests = subparsers.add_parser('framework_server_functional_tests', description='Slipstream Test Step 1 - Server Test')

    parser_framework_server_unit_tests = subparsers.add_parser('framework_server_unit_tests', description='Slipstream Test Step 2 - Server Unit Test')

    parser_framework_client_unit_tests = subparsers.add_parser('framework_client_unit_tests', description='Slipstream Test Step 3 - Client Test')

    parser_export = subparsers.add_parser('export', description='Export artifacts to binary repo')
    parser_export.add_argument('-v', dest='version', type=str, required=True, help='Versioning used for major/minor releases')
    parser_export.add_argument('-r', dest='release', type=str, required=True, help='Release for major/minor releases')
    parser_export.add_argument('-n', dest='seq_no', type=int, required=True,
                               help='Sequence number used to export binary artifact')
    parser_export.add_argument('-s', dest='sdk_export', action="store_true", required=False,
                               help='boolean used to export sdk artifact')
    parser_export.add_argument('-u', dest='ui_export', action="store_true", required=False,
                               help='boolean used to export ui artifact')

    parser_export_widget = subparsers.add_parser('export_widget', description='Export slipstream widgets to binary repo')
    parser_export_widget.add_argument('-b', dest='build_number', type=str, required=True, help='Sequence number used to export binary artifact')
    parser_export_widget.add_argument('-i', dest='build_id', type=str, required=True, help='Build ID used to export binary artifact')
    parser_export_widget.add_argument('-w', dest='workspace_path', type=str, required=True, help='Workspace Path')
    parser_export_widget.add_argument('-v', dest='version', type=int, required=True, help='Version Number')
    parser_export_widget.add_argument('-a', dest='artdir', type=str, required=True, help='Framework Directory')
    parser_export_widget.add_argument('-t', dest='type', type=str, required=True, help='Type of Build')
    parser_export_widget.add_argument('-r', dest='release', type=str, required=True, help='Release for major/minor releases')     

    opt = parser.parse_args(args)
    return opt


if __name__ == '__main__':
    options = parse_options(sys.argv[1:])
    pipeline = Pipeline(options)
    start = datetime.now()
    print 'Start  %s ...' % options.command
    getattr(pipeline, options.command)()
    print 'End  %s ...' % options.command
    delta = datetime.now() - start
    print 'Duration of %s step : %d days, %d hours and %0.3f minutes' % (options.command, delta.days, delta.seconds // 3600, delta.seconds % 3600 / 60.0)
