%define jmp_mod sdui
%define ss_location /usr/local/slipstream
%define ss_plugin_install_loc %{ss_location}/public/installed_plugins
%define maintDir %{ss_location}/external-plugins/jmp-%{jmp_mod}
%define ss_user  slipstream
%define ss_group slipstream
%define web_proxy /etc/httpd/conf.d/webProxy.conf
%define _binary_payload 1
%define _binary_filedigest_algorithm 1

Name: jmp-%{jmp_mod}
Summary: Security Director UI
Epoch: 0
Version: %{jmp_version_num}
Release: %{jmp_cl_num} 
License: Commercial
Group: JMP
BuildRoot:  %{_tmppath}/%{name}-%{version}
AutoReqProv: no
Requires: Slipstream

%description
Security Director User Interface

%prep
%setup -c -T

%build

%install
echo "RPM_SOURCE_DIR=$RPM_SOURCE_DIR"
RPM_BUILD_LOC=$RPM_BUILD_ROOT%{maintDir}
mkdir -p $RPM_BUILD_LOC
tar -C %{jmp_top}/ui/rpms/jmp-sdui -cf - conf | tar -C $RPM_BUILD_LOC -xf -
PLUGIN_MANAGER_SCRIPT=$RPM_BUILD_LOC/conf/plugin_manager.sh
cd %{jmp_top}/ui/plugins
for plugin in `ls -1`; do
  if [ -d ${plugin} ]; then
    rm -f ${plugin}.spi
    ${PLUGIN_MANAGER_SCRIPT} -c ${plugin}
    mv ${plugin}.spi ${RPM_BUILD_LOC}/
  fi
done

%clean

%files
%attr(755, %{ss_user}, %{ss_group}) %{maintDir}
%attr(755, %{ss_user}, %{ss_group}) %{maintDir}/*

%pre
/etc/init.d/slipstream stop
#For upgrade remove existing plugins
if [ $1 -eq 2 ]; then
cd %{maintDir}
%{maintDir}/conf/post_uninstall.sh %{ss_location} %{ss_plugin_install_loc} %{ss_user}
fi

%post
#Install Plugins
cd %{maintDir}
%{maintDir}/conf/post_install.sh %{ss_location} %{ss_plugin_install_loc} %{ss_user}
%{maintDir}/conf/configure_slipstream.sh %{jmp_version_num} %{jmp_rel_num}
#Start slipstream
/sbin/chkconfig --add slipstream
/etc/init.d/slipstream start

%preun
#Uninstall Plugins for erase (not upgrade)
if [ $1 -eq 0 ]; then
cd %{maintDir}
%{maintDir}/conf/post_uninstall.sh %{ss_location} %{ss_plugin_install_loc} %{ss_user}
fi
