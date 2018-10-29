define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../conf/phase1FormConfiguration.js',
    '../conf/phase1CustomProposalGridConf.js'
], function (Backbone, Syphon, FormWidget, GridWidget, Phase1FormConfiguration, Phase1CustomGridConf) {

    var dhGroups = {
        "Group 1" : "group1",
        "Group 2" : "group2",
        "Group 5" : "group5",
        "Group 14" : "group14",
        "Group 19" : "group19",
        "Group 20" : "group20",
        "Group 24" : "group24"
    };
    var authentications = {
        "MD5": "md5",
        "SHA-1": "sha_1",
        "SHA-256": "sha2_256",
        "SHA-384": "sha3_384"
    };
    var encryptions = {
        "DES": "des_cbc",
        "3DES": "triple_des_cbc",
        "AES(128)": "aes_cbc_128",
        "AES(192)": "aes_cbc_192",
        "AES(256)": "aes_cbc_256"
    };

    var Phase1View = Backbone.View.extend({
            events: {
                'validLifeTime #phase1-configuration': 'validateForm'
            },
        initialize : function(options){
            this.context = options.context;
            this.formMode = options.formMode;
            this.customGridData = new Backbone.Collection();

        },

        render : function(){
            var self = this;

            var formConfiguration = new Phase1FormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            // this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.toJSON()
            });
            this.form.build();
            this.createPhase1CustomProposalGrid();
            this.$el.find('input[name=enable-nat-traversal]').change(function() {
                if(this.checked){
                    self.natTraversalChangeHandler("enable");
                }else{
                    self.natTraversalChangeHandler("disable");
                }
            });
            this.$el.find('input[id=general-ikeid]').change(function() {
                if(this.checked){
                    self.generalIkeIdChangeHandler("enable");
                }else{
                    self.generalIkeIdChangeHandler("disable");
                }
            });

            this.$el.find('input[name=enable-dpd]').change(function(){
                if(this.checked){
                    self.changeDPDElementsState("enable");
                }else{
                    self.changeDPDElementsState("disable");
                }
            });
            this.$el.find('input[type=radio][name=mode]').click(function() {
                self.modeChangeHandler(this.value);
            });

            this.$el.find('input[type=radio][name=phase1-proposal-type]').click(function() {
                self.proposalTypeChangeHandler(this.value);
            });

            this.$el.find('select[id="auth-method"]').change(function() {
                self.authenticationChangeHandler(this.value);
            });

            this.$el.find('select[id="ike-id"]').change(function() {
                self.ikeIdChangeHandler(this.value);
            });

            this.$el.find('input[id="nat-traversal-keep-alive"],input[id="dpd-interval"]').on("keypress",function(key) {
                var keycode = key.which;
                if (!(keycode==8 || keycode==0 )&&(keycode<48 || keycode>57)) return false;
            });

            this.$el.find('input[id="nat-traversal-keep-alive"],input[id="dpd-interval"]').on("cut copy paste",function(e) {
                e.preventDefault();
            });

            if(Object.keys(this.model.toJSON()).length !== 0){
                this.modifyForm();
            }
            else{
                //set defaults for fileds
                this.setDefaults();
            }
            if(this.formMode == "VIEW"){
                this.$el.find(".action-filter-container").hide();
            }
            return this;
        },

        /*
            Incase of modify and clone fill the form values with the data of the selected profile
        */
        modifyForm : function(data){
            if(this.$el.find('#nat-traversal-keep-alive').val() === "0"){
                            this.$el.find('#nat-traversal-keep-alive').val("");
             }
            this.$el.find('select[id="auth-method"]').val(this.model.get("auth-method")).trigger("change");
	    this.modeChangeHandler(this.model.get("mode"));
            // this.$el.find('input[type=radio][name=mode]').val(this.model.get("mode")).trigger("click");
            if(this.model.get("mode") === "MAIN"){
                this.$el.find('input:radio[name=mode]:nth(0)').attr('checked',true).trigger("click");
            }else if(this.model.get("mode") === "AGGRESSIVE"){
                this.$el.find('input:radio[name=mode]:nth(1)').attr('checked',true).trigger("click");
            }else {
                 this.$el.find('input:radio[name=mode]:nth(2)').attr('checked',true).trigger("click");
            }
            this.$el.find('select[id="ike-id"]').val(this.model.get("ike-id")).trigger("change");
            this.$el.find('input[id="general-ikeid"]').attr("checked", this.model.get("general-ikeid")).trigger("change");
            this.$el.find('select[id="ike-version"]').val(this.model.get("ike-version"));
            var proposalType = this.model.get("phase1-proposal-type");
            // this.$el.find('input[type=radio][name=phase1-proposal-type]').val(proposalType).trigger("change");
            if(proposalType === "PREDEFINED"){
                this.$el.find('input:radio[name=phase1-proposal-type]:nth(0)').attr('checked',true).trigger("click");
                this.$el.find('select[id="phase1-predefined-proposal-set"]').val(this.model.get("phase1-predefined-proposal-set"));
            }else{
                this.$el.find('input:radio[name=phase1-proposal-type]:nth(1)').attr('checked',true).trigger("click");
                this.customGridData = new Backbone.Collection(this.model.get("custom-phase1-proposals")["phase1-proposal"]);
                this.customGrid.addRow(this.customGridData.toJSON());
                var gridContainer = this.$el.find('.customgrid');
                if(this.customGridData.length >= 4) {
                    gridContainer.find('.create').hide();
                }
            }
            this.$el.find('input[name=enable-nat-traversal]').attr("checked", this.model.get("enable-nat-traversal")).trigger("change");
            this.$el.find('input[name=enable-dpd]').attr("checked", this.model.get("enable-dpd")).trigger("change");
            if(this.model.get("enable-dpd") === true){
                this.$el.find('input[name=always-send-dpd]').attr("checked", this.model.get("always-send-dpd"));
                this.$el.find('select[name=dpd-threshold]').val(this.model.get("dpd-threshold")) ;
            }
        },

        //set the defaults for the fields
        setDefaults : function(){
             //by default disable DPD elements
            this.changeDPDElementsState("disable");

            //by default hide the VPN Optimized checkbox
            this.$el.find('.vpnmonitor').hide();

        },


        /*
            Custom proposal grid creation
        */
        createPhase1CustomProposalGrid : function(){
            var self = this;
            var gridContainer = this.$el.find('.customgrid').empty();

            var actionEvents = {
                createEvent:"AddRow",
                updateEvent: 'UpdateRow',
                deleteEvent: 'DeleteRow'
            };

            this.$el
            .bind(actionEvents.createEvent, function(e, addGridRow){
                console.log(addGridRow);
                var addedRow = addGridRow.updatedRow;
                //TODO: workaround because the grid ro does not give the value for dropdown insted gives labels
                var dhGroup = addedRow["dh-group"];
                addedRow["dh-group"] = dhGroups[dhGroup];
                var authentication = addedRow["authentication-algorithm"];
                addedRow["authentication-algorithm"] = authentications[authentication];
                var encryption = addedRow["encryption-algorithm"];
                addedRow["encryption-algorithm"] = encryptions[encryption];
                //end TODO

                //collection will not be udpated during creation of a new row,
                //length counter will be increased when row is exiting from edit mode.
                if(self.customGridData.length >= 3) {
                    gridContainer.find('.create').hide();
                }
            })
            .bind(actionEvents.updateEvent, function(e, updatedGridRow){
                console.log(updatedGridRow);
                var updatedRow = updatedGridRow.updatedRow;
                var originalRow = updatedGridRow.originalData;

                var dhGroup = updatedRow["dh-group"];
                if(dhGroups[dhGroup] != undefined)
                    updatedRow["dh-group"] = dhGroups[dhGroup];
                var authentication = updatedRow["authentication-algorithm"];
                if(authentications[authentication] != undefined)
                    updatedRow["authentication-algorithm"] = authentications[authentication];
                var encryption = updatedRow["encryption-algorithm"];
                if(encryptions[encryption] != undefined)
                    updatedRow["encryption-algorithm"] = encryptions[encryption];

                //this logic is to prevent adding row data twice to the collection because gridwidget updateEvent
                //triggering for two times for single update of row
                var updateFlag = true;
                self.customGridData.each(function (item, index, all) {
                    if(item.get("id") === updatedRow.id ||
                        item.get("id") === originalRow.id) {
                        item.set('name', updatedRow["name"]);
                        item.set('dh-group', updatedRow["dh-group"]);
                        item.set('authentication-algorithm', updatedRow["authentication-algorithm"]);
                        item.set('encryption-algorithm', updatedRow["encryption-algorithm"]);
                        item.set('lifetime', updatedRow["lifetime"]);
                        updateFlag = false;
                    }
                });

                if(updateFlag || self.customGridData.length <= 0) {
                    self.customGridData.add(updatedRow);
                }

                // if (_.size(updatedGridRow)==1) self.updateRow(updatedGridRow);
            })
            .bind(actionEvents.deleteEvent, function(e, deletedGridRows){
                console.log(deletedGridRows);
                var len = deletedGridRows.deletedRows.length;
                for(var i=0;i<len;i++) {
                    var name = deletedGridRows.deletedRows[i].name;
                    self.customGridData.remove(self.customGridData.findWhere({"name": name}));
                }
                if(self.customGridData.length <= 4) {
                    gridContainer.find('.create').show();
                }
            });

            var gridConf = new Phase1CustomGridConf(this.context);
            this.customGrid = new GridWidget({
                container: gridContainer,
                elements: gridConf.getValues(),
                actionEvents: actionEvents
             }).build();

        },


        /*
        Hide or show the remaining DPD elements based on the state of the Enable DPD checkbox
        */
        changeDPDElementsState : function(state){
            if(state === "enable"){
                this.$el.find('.dpdproperties').show();
                    if(this.$el.find('input[name=dpd-interval]').val() === "0"){
                       this.$el.find('input[name=dpd-interval]').val("");
                      }
            }else{
                this.$el.find('input[name=always-send-dpd]').attr('checked',false);
                this.$el.find('input[name=dpd-interval]').val("") ;
                this.$el.find('select[name=dpd-threshold]').val("") ;
                this.$el.find('.dpdproperties').hide();
            }
        },

        /*
        Change the values in the IKE ID dropdown box based on mode selection
        */

        modeChangeHandler : function(modeSelected){
            var authentication = this.$el.find('#auth-method').val();
            if(modeSelected === "MAIN" || modeSelected === "DEFAULT"){
                this.$el.find(".general-ikeid").show();
                if(authentication === "PRESHARED_KEY"){
                    if(this.$el.find("#ike-id option[value=IPADDRESS]").length === 0){
                        this.$el.find('#ike-id').append( new Option("IPAddress","IPADDRESS"));
                    }
                    if(this.$el.find("#ike-id option[value=NONE]").length === 0){
                        this.$el.find('#ike-id').append( new Option("None","NONE"));
                     }
                }
            }else{
                this.$el.find('input[id="general-ikeid"]').attr("checked", false).trigger("change");
                this.$el.find(".general-ikeid").hide();
                if(authentication === "PRESHARED_KEY"){

                this.$el.find("#ike-id option[value=IPADDRESS]").remove();
                this.$el.find("#ike-id option[value=NONE]").remove();
                }
            }

        },

        /*
        Hide or show the predefined proposal set fields based on the proposal type
        */
        proposalTypeChangeHandler : function(proposalType){
            if(proposalType === "PREDEFINED"){
                this.$el.find('.phase1proposalSet').show();
                this.$el.find('.customgrid').hide();
            }else{
                this.$el.find(".phase1proposalSet").hide();
                this.$el.find('.customgrid').show();
            }

        },



        /*
        Updates the values in the predefined proposal sets based on the authentication type
        */
        authenticationChangeHandler : function(value){

            /*if RSA/DSA signature are selected for authentication set the porposal type to custom
            hide the proposal type radio buttons
            for other options show the predefined proposals radio selection and also 
            update the predefined proposal sets dropdown values
            */
            if (value === "RSA_SIGNATURE" || value === "DSA_SIGNATURE"){
                this.$el.find(".phase1proposaltypelabel").show();
                //set the proposal type to custom and trigger the click event so that proposalsets field is hidden
                this.$el.find('input:radio[name=phase1-proposal-type]:nth(1)').attr('checked',true).trigger("click");
                this.$el.find(".phase1proposaltype").hide();
            }else{
                //update values in the predefined proposal based on authentication selection 
                this.updatePredefinedProposalCombo(value);
                this.$el.find(".phase1proposaltypelabel").hide();
                this.$el.find(".phase1proposaltype").show();
            }

            var isGeneralIKEID = this.$el.find('input[id="general-ikeid"]').is(':checked');


            /*if authentication is anything other than preshared key remove the IPaddress option 
                and add the DN option to the ikeID selections
            */
            if(value !== "PRESHARED_KEY"){
                this.$el.find("#ike-id option[value=IPADDRESS]").remove();
                 this.$el.find("#ike-id option[value=NONE]").remove();
                if(this.$el.find("#ike-id option[value=DN]").length === 0){
                    this.$el.find('#ike-id').append( new Option("DN","DN"));
                }
                if(isGeneralIKEID) {
                    this.$el.find('#ike-id').prop("disabled",false);
                    if(this.$el.find("#ike-id option[value=NONE]").length === 0){
                      this.$el.find('#ike-id').append( new Option("None","NONE"));
                    }
                }
                
            }else{
                this.$el.find("#ike-id option[value=DN]").remove();
                var mode = this.$el.find("input[name=mode]:checked").val();
                if(mode === "MAIN" || mode === "DEFAULT"){
                   if(this.$el.find("#ike-id option[value=IPADDRESS]").length === 0){
                      this.$el.find('#ike-id').append( new Option("IPAddress","IPADDRESS"));
                      }
                   if(this.$el.find("#ike-id option[value=NONE]").length === 0){
                      this.$el.find('#ike-id').append( new Option("None","NONE"));
                    }
                    this.$el.find('input[id="general-ikeid"]').attr("checked", true).trigger("change");
                }

            }
            
        },

        /*
            If Ike ID is user@hostname then the user has to eneter the user for the host
        */

        ikeIdChangeHandler : function(ikeId){
            if(ikeId === "UFQDN"){
                this.$el.find(".user").show();
            }else{
                this.$el.find(".user").hide();
            }
        },
        /*
        *If enable nat traversal is unchecked then hide kepp alive interval
        */
        natTraversalChangeHandler : function(state){
            if(state === "enable"){
                this.$el.find('.natproperties').show();
            }else{
                this.$el.find('#nat-traversal-keep-alive').val("");
                this.$el.find('.natproperties').hide();
            }
        },

        /*
        *If enable nat traversal is unchecked then hide kepp alive interval
        */
        generalIkeIdChangeHandler : function(state){
            if(state === "enable"){               
                var authentication = this.$el.find('#auth-method').val();
                if(authentication === "PRESHARED_KEY"){
                    this.form.getInstantiatedWidgets()['dropDown_ike-id'].instance.setValue('NONE');
                    this.$el.find('#ike-id').prop("disabled",true);
                    this.$el.find(".user").hide();
                } else {
                    if(this.$el.find("#ike-id option[value=NONE]").length === 0){
                      this.$el.find('#ike-id').append( new Option("None","NONE"));
                    }
                }
            }else{
                this.$el.find('#ike-id').prop("disabled",false);
                var authType = this.$el.find('#auth-method').val();
                var mode = this.$el.find("input[name=mode]:checked").val();
                if(authType != "PRESHARED_KEY" || (mode === "AGGRESSIVE" )) {
                    this.$el.find("#ike-id option[value=NONE]").remove();
                }
            }
        },

        /*
        updating the values in the predefined proposal set dropdown
        based on the authentication selected
        */

        updatePredefinedProposalCombo : function(value){
            var $proposalSet = this.$el.find('#phase1-predefined-proposal-set');

            if(value === "EC_DSA_SIGNATURE_256" || value === "EC_DSA_SIGNATURE_384"){
                this.$el.find('#phase1-predefined-proposal-set option').remove();
                $proposalSet.append(new Option("SuiteB-GCM-128","suiteb_gcm_128"));
                $proposalSet.append(new Option("SuiteB-GCM-256","suiteb_gcm_256"));
            }else{
                this.$el.find('#phase1-predefined-proposal-set option').remove();
                $proposalSet.append(new Option("Basic","Basic"));
                $proposalSet.append(new Option("Standard","Standard"));
                $proposalSet.append(new Option("Compatible","Compatible"));
            }
        },

        convertViewToData: function(phase1Settings){
            // var phase1Settings = {};

            // phase1Settings["mode"] = formData["mode"];
            // phase1Settings["ike-id"] = formData["ike-id"];
            // phase1Settings["ike-version"] = formData["ike-version"],
            // phase1Settings["auth-method"] = formData["authentication"];
            // phase1Settings["phase1-proposal-type"] = formData["phase1-proposal-type"];
            // if(phase1Settings["phase1-proposal-type"] === "Basic"){
            //     phase1Settings["phase1-predefined-proposal-set"] = formData["phase1-predefined-proposal-set"];
            // }else{
                if(this.customGridData.length != 0){
                    var customData = this.customGridData.toJSON();
                    customData.forEach(function (object) {
                        delete object.id;
                    });
                    var customProposals = {}
                    customProposals["phase1-proposal"]=customData;
                    phase1Settings["custom-phase1-proposals"] = customProposals;
                }else{
                    var customProposals = {}
                    customProposals["phase1-proposal"]=[];
                    phase1Settings["custom-phase1-proposals"] = customProposals;
                }
            // }
           
            
            // phase1Settings["enable-nat-traversal"] = formData["enableNatTraversal"];
            // phase1Settings["nat-traversal-keep-alive"] = formData["nat-traversal-keep-alive"];
            // phase1Settings["enable-dpd"] = formData["enableDpd"];
            // phase1Settings["always-send-dpd"] = formData["alwaysSendDpd"];
            // phase1Settings["dpd-interval"] = formData["dpdInterval"];
            // phase1Settings["dpd-threshold"] = formData["dpdThreshold"];


            return phase1Settings;         
        },

        getViewData : function(){
            if (this.form && this.form.isValidInput()) {
                var results = Syphon.serialize(this);
                data = this.convertViewToData(results);
                console.log("Phase1 data");
                console.log(data);
                return data;
            }
        },
        validateForm: function (event) {
            var me = this, el, value = event.target.value, name, removeError = false;
            // get target name
            name = event.target.name;
            el = me.$el.find('.editable[name="lifetime"]');

            if(el.parent().find(".error").length == 0)
            {
                el.after("<small class='error errorimage'></small>");
            }
               if (value) {
                 if(isNaN(value) === true || value.indexOf(" ") !== -1){
                 el.parent().find(".error").html(this.context.getMessage("enter_numbers_only"));
                } else{
                if (value.trim() < 180 || value.trim() > 86400) {
                    el.parent().find(".error").html(this.context.getMessage("lifeTime_range"));
                }
                else {
                    el.parent().find(".error").remove();
                }
               }
            } else {
                    el.parent().find(".error").remove();
            }
        }
    });

    return Phase1View;
});
