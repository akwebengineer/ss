#!/usr/local/bin/python
import sys
import os
sys.path.append('build')
import pipeline
from datetime import datetime
from pipeline import Pipeline

class SDUIPipeline(Pipeline):
  def __init__(self, options):
    Pipeline.__init__(self, options)

  def changeDir(self):
    os.chdir('%s/ui' % self.workspace)
    print 'Current Dir  %s' % (self.workspace)

  def export(self):
    Pipeline.export(self)

    #Full Version
    fullVersion = '%s%s.%s' % (self.version, self.release, self.opt.seq_no)

    """ Upload to repo """
    buildRoot = os.environ['SD_BUILD_TMP']
    os.chdir('/tmp/')
    rpmSuffix = '%s-%s.x86_64.rpm' % (self.version, self.opt.seq_no)
    artifactId = 'Security-Director-UI'
    command = self.mvn + ' deploy:deploy-file \
	  -Durl=%s \
	  -DgroupId=%s \
		    -DartifactId=%s \
		    -Dfile=%s/rpms/jmp-sdui-%s \
		    -Dversion=%s ' % (self.mvn_repo, self.mvn_groupId, artifactId,
		buildRoot, rpmSuffix, fullVersion)

    if self.opt.production:
      self.execute(command)

if __name__ == '__main__':
    parser = pipeline.get_arg_parser()
    options = parser.parse_args(sys.argv[1:])
    
    pipeline = SDUIPipeline(options)
    start = datetime.now()
    print 'Start  %s ...' % (options.command)
    getattr(pipeline, options.command)()
    print 'End  %s ...' % (options.command)
    delta = datetime.now() - start
    print 'Duration of %s step : %d days, %d hours and %0.3f minutes' % (options.command, delta.days, delta.seconds // 3600, delta.seconds % 3600 / 60.0)
