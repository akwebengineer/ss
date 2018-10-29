%define maintDir /usr/local/
%define ss_user  slipstream
%define ss_group slipstream

Name:           SlipstreamSDK-%{osname}
Version:        %{ss_version_num}.%{ss_release_num}
Release:        %{ss_cl_num}
Summary:        SDK for Slipstream Framework
AutoReqProv: no
License:        Commercial
Group:          SBU Customer Experience

%description
SDK for Slipstream Framework

%prep

%build
echo "RPM_SOURCE_DIR=$RPM_SOURCE_DIR"
echo "in build step -----"
tar -C %{ss_top}/slipstream/dist -cf slipstream_sdk.tar slipstream_sdk_%{osname}

%install
install -m 0755 -d $RPM_BUILD_ROOT%{maintDir}/slipstream/
tar -C $RPM_BUILD_ROOT%{maintDir}/slipstream/ -xf slipstream_sdk.tar

%clean
rm -rf $RPM_BUILD_ROOT

%post
./$RPM_BUILD_ROOT%{maintDir}/slipstream/slipstream_sdk_%{osname}/sdk_installer.sh
rm ./$RPM_BUILD_ROOT%{maintDir}/slipstream/slipstream_sdk_%{osname}/sdk_installer.sh
rm ./$RPM_BUILD_ROOT%{maintDir}/slipstream/slipstream_sdk_%{osname}/dependency_installer.sh

%postun
#delete all dependencies along with the SDK and the environment file, if rpm is uninstalled
if [[ -d "$RPM_BUILD_ROOT%{maintDir}/slipstream/slipstream_sdk_%{osname}" ]];
then
        rm -rf $RPM_BUILD_ROOT%{maintDir}/slipstream/slipstream_sdk_%{osname}
fi

if [[ -f "$HOME/local/sdk.env" ]];
then
        rm $HOME/local/sdk.env
fi

%files
%dir %{maintDir}/slipstream/slipstream_sdk_%{osname}
%{maintDir}/slipstream/slipstream_sdk_%{osname}/sdk_installer.sh
%{maintDir}/slipstream/slipstream_sdk_%{osname}/dependency_installer.sh
%{maintDir}/slipstream/slipstream_sdk_%{osname}/dependency_installer.sh
