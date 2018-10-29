define([
    'backbone',
    'backbone.syphon',
    'widgets/form/formWidget',
    'widgets/grid/gridWidget',
    '../conf/phase2FormConfiguration.js',
    '../conf/phase2CustomProposalGridConf.js'
], function (Backbone, Syphon, FormWidget, GridWidget, Phase2FormConfiguration, Phase2CustomGridConf) {
   
   //TODO : Delete when grid returns correct values
   
    var authentications = {
        "MD5": "md5",
        "SHA-1": "sha_1",
        "SHA-256(96)": "hmac_sha_256_96",
        "SHA-256(128)": "hmac_sha_256_128"
    };

    var protocols = {

        "ESP":"esp",
        "AH":"ah"
    };

    var encryptions = {
        "DES": "des_cbc",
        "3DES": "triple_des_cbc",
        "AES(128)": "aes_cbc_128",
        "AES(192)": "aes_cbc_192",
        "AES(256)": "aes_cbc_256",
        "AES-GCM(128)": "aes_gcm_128",
        "AES-GCM(192)": "aes_gcm_192",
        "AES-GCM(256)": "aes_gcm_256"
    };
    //End TODO

    var Phase2View = Backbone.View.extend({
        events: {
            'validLifeTime #phase2-configuration': 'validateForm',
            'validLifeSize #phase2-configuration': 'validateForm'
        },
        initialize : function(options){

            this.context = options.context;
            this.customGridData = new Backbone.Collection();
            this.formMode = options.formMode;
            this.render();

        },
        render :function(){
            var self = this;

            var formConfiguration = new Phase2FormConfiguration(this.context);

            var formElements = formConfiguration.getValues();

            // this.addDynamicFormConfig(formElements);

            this.form = new FormWidget({
                container: this.el,
                elements: formElements,
                values: this.model.toJSON()
            });
            this.form.build();

            this.createPhase2CustomProposalGrid();
            this.$el.find('input[type=radio][name=phase2-proposal-type]').click(function() {
                self.phase2ProposalTypeChangeHandler(this.value);
            });

            this.$el.find('input[name=enable-vpn-monitor]').change(function(){
                if(this.checked){
                    self.$el.find('.vpnmonitor').show();
                }else{
                    self.$el.find('input[name=enable-vpn-optimized]').attr('checked',false);
                    self.$el.find('.vpnmonitor').hide();
                }
            });

            this.$el.find('input[id="idle-time"]').on("keypress",function(key) {
                    var keycode = key.which;
                    if (!(keycode==8 || keycode==0 )&&(keycode<48 || keycode>57)) return false;
            });

            this.$el.find('input[id="idle-time"]').on("cut copy paste",function(e) {
                e.preventDefault();
            });

            this.$el.find('#phase2grid').on("click","select[name=encryption-algorithm]", function(e){
                this.options[8].disabled = true;
            });
            this.$el.find('#phase2grid').on("click","select[name=authentication-algorithm]", function(e){
                this.options[4].disabled = true;
            })
            // If protocol = ah , encryption algorithm should be  "NONE" value
            //Authentication-algorithm,should get removed or marked as NONE when AES-GCM is selected as encryption
            this.$el.find('#phase2grid').on("change","select[name=protocol]", function(e){
                var encryption_algorithm = self.$el.find('#phase2grid select[name="encryption-algorithm"]');
                var authentication_algorithm = self.$el.find('#phase2grid select[name="authentication-algorithm"]');
                if(this.value == "ah"){
                    encryption_algorithm.val("NONE"); // for "ah" protocol: encryption "NONE"
                    if(authentication_algorithm.val() == "NONE" || authentication_algorithm.val() === null  ){
                        authentication_algorithm.val("sha_1"); //  if encryption "NONE" authentication_algorithm should not be "NONE", so setting default value in the grid
                    }
                } else{
                       encryption_algorithm.val("aes_cbc_128"); // setting default value in the grid
                    }
            });

            this.$el.find('#phase2grid').on("change","select[name=encryption-algorithm]", function(e){
                 var authentication_algorithm = self.$el.find('#phase2grid select[name="authentication-algorithm"]');
                 var protocol =  self.$el.find('#phase2grid select[name="protocol"]');
		         protocol.val("esp"); // protocol should be "esp", if encryption-algorithm is not "NONE"
                 if(this.value === "aes_gcm_128" || this.value === "aes_gcm_192" || this.value === "aes_gcm_256"){
                     authentication_algorithm.val("NONE");
                 } else{
                       if(authentication_algorithm.val() === "NONE" || authentication_algorithm.val() === null )
                         authentication_algorithm.val("sha_1"); // setting default grid value
                 }
            });

            this.$el.find('#phase2grid').on("change","select[name=authentication-algorithm]", function(e){
                    var encryption_algorithm = self.$el.find('#phase2grid select[name="encryption-algorithm"]');
			        if(encryption_algorithm.val()  === "aes_gcm_128" ||
			            encryption_algorithm.val()  === "aes_gcm_192" ||
			            encryption_algorithm.val()  === "aes_gcm_256"){
                        encryption_algorithm.val("aes_cbc_128"); // setting default grid value
                     }
            });

            if(Object.keys(this.model.toJSON()).length !== 0){
                this.modifyForm();
            } else{
                //set defaults for fileds
                this.setDefaults();
            }
            if(this.formMode == "VIEW"){
                this.$el.find(':input:not(:disabled)').prop('disabled',true);
                this.$el.find(".action-filter-container").hide();
            }
            return this;
        },

        /*
            Set default state for the fields
        */
        setDefaults :function(){
            this.$el.find('.vpnmonitor').hide();
        },

        /*
            Incase of modify and clone fill the form values with the data of the selected profile
        */
        modifyForm : function(data){
            var proposalType = this.model.get("phase2-proposal-type");
            if(proposalType === "PREDEFINED"){
                this.$el.find('input:radio[name=phase2-proposal-type]:nth(0)').attr('checked',true).trigger("click");
                this.$el.find('select[id="phase2-predefined-proposal-set"]').val(this.model.get("phase2-predefined-proposal-set"));
            }else{
                this.$el.find('input:radio[name=phase2-proposal-type]:nth(1)').attr('checked',true).trigger("click");
                this.customGridData = new Backbone.Collection(this.model.get("custom-phase2-proposals")["phase2-proposal"]);
                this.customGrid.addRow(this.customGridData.toJSON());
                var gridContainer = this.$el.find('.phase2customgrid');
                if(this.customGridData.length >= 4) {
                    gridContainer.find('.create').hide();
                }
            }
            this.$el.find('select[id="pfs"]').val(this.model.get("pfs"));
            this.$el.find('input[name=establish-tunnel-immediately]').attr("checked", this.model.get("establish-tunnel-immediately"));
            this.$el.find('input[name=enable-vpn-monitor]').attr("checked", this.model.get("enable-vpn-monitor")).trigger("change");
            this.$el.find('input[name=enable-vpn-optimized]').attr("checked", this.model.get("enable-vpn-optimized"));
            this.$el.find('select[id="dfbit"]').val(this.model.get("dfbit"));
            this.$el.find('select[id="install-time"]').val(this.model.get("install-time"));
            this.$el.find('input[name=enable-anti-replay]').attr("checked", this.model.get("enable-anti-replay"));
        },

        /*
        Hide or show the predefined proposal set fields based on the proposal type
        */
        phase2ProposalTypeChangeHandler : function(proposalType){
            if(proposalType === "PREDEFINED"){
                this.$el.find(".phase2proposalSet").show();
                    this.$el.find('.phase2customgrid').hide();
            }else{
                this.$el.find(".phase2proposalSet").hide();
                    this.$el.find('.phase2customgrid').show();
            }

        },

        /*
            Custom proposal grid creation
        */
        createPhase2CustomProposalGrid : function(){
                var self = this;
            var gridContainer = this.$el.find('.phase2customgrid').empty();

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
                var authentication = addedRow["authentication-algorithm"];
                addedRow["authentication-algorithm"] = authentications[authentication];
                var protocol = addedRow["protocol"];
                addedRow["protocol"] = protocols[protocol];
                var encryption = addedRow["encryption-algorithm"];
                addedRow["encryption-algorithm"] = encryptions[encryption];
                //end TODO

                //collection will not be udpated during creation of a new row,
                //length counter will be increased when row is exiting from edit mode
                if(self.customGridData.length >= 3) {
                    gridContainer.find('.create').hide();
                }

                // if (_.size(addGridRow)==1) self.addRow(addGridRow);
            })
            .bind(actionEvents.updateEvent, function(e, updatedGridRow){
                console.log(updatedGridRow);
                var updatedRow = updatedGridRow.updatedRow;
                var originalRow = updatedGridRow.originalData;
                var authentication = updatedRow["authentication-algorithm"];
                if(authentications[authentication] != undefined)
                    updatedRow["authentication-algorithm"] = authentications[authentication];
                var protocol = updatedRow["protocol"];
                if(protocols[protocol] != undefined)
                    updatedRow["protocol"] = protocols[protocol];
                var encryption = updatedRow["encryption-algorithm"];
                if(encryptions[encryption] != undefined)
                    updatedRow["encryption-algorithm"] = encryptions[encryption];

                if(encryption === "aes_gcm_128" || encryption === "AES-GCM(128)" ||
                    encryption === "aes_gcm_192" || encryption === "AES-GCM(192)" ||
                    encryption === "aes_gcm_256" || encryption === "AES-GCM(256)") {
                        updatedRow["authentication-algorithm"] = "NONE";
                }

                //this logic is to prevent adding row data twice to the collection because gridwidget updateEvent
                //triggering for two times for single update of row
                var updateFlag = true;
                self.customGridData.each(function (item, index, all) {
                    if(item.get("id") === updatedRow.id ||
                        item.get("id") === originalRow.id) {
                        item.set('name', updatedRow["name"]);
                        item.set('authentication-algorithm', updatedRow["authentication-algorithm"]);
                        item.set('encryption-algorithm', updatedRow["encryption-algorithm"]);
                        item.set('life-size', updatedRow["life-size"]);
                        item.set('lifetime', updatedRow["lifetime"]);
                        item.set('protocol', updatedRow["protocol"]);

                        updateFlag = false;
                    }
                });

                if(updateFlag || self.customGridData.length <= 0) {
                    self.customGridData.add(updatedRow);
                }

                // if (_.size(updatedGridRow)==1) self.updateRow(updatedGridRow);
            })
            .bind(actionEvents.deleteEvent, function(e, deletedGridRows){
                var len = deletedGridRows.deletedRows.length;
                for(var i=0;i<len;i++) {
                    var name = deletedGridRows.deletedRows[i].name;
                    self.customGridData.remove(self.customGridData.findWhere({"name": name}));
                }
                if(self.customGridData.length <= 4) {
                    gridContainer.find('.create').show();
                }

                console.log(deletedGridRows);
            });

            var gridConf = new Phase2CustomGridConf(this.context);
            this.customGrid = new GridWidget({
                container: gridContainer,
                elements: gridConf.getValues(),
                actionEvents: actionEvents
             }).build();

            //TODO: make these changes when grid supports the event passing to the application when the action buttons are clicked
             // var encrptionColumn = this.customGrid.find(".phase2-encryption");
             // var encrptionColumn = this.find('[name="encryption-algorithm"]')
            //  this.$el.find('[name="encryption-algorithm"]').change(function(){
            //     var encrytionVal = this.value;
            //     var authenticationAlgm = self.find('[name="authentication-algorithm"]')
            //     if(encrytionVal === "aes_gcm_128" || encrytionVal === "aes_gcm_129" || encrytionVal === "aes_gcm_256"){
            //         authenticationAlgm.attr("disabled","disabled");
            //     }else{
            //         authenticationAlgm.removeAttr("disabled");
            //     }

            // });
            //end TODO
        },

        convertViewToData: function(phase2Settings){

            if(this.customGridData.length != 0){
                var customData = this.customGridData.toJSON();
                customData.forEach(function (object) {
                   delete object.id;
                });
                var customProposals = {}
                console.log(customData);
                customProposals["phase2-proposal"]=customData;
                phase2Settings["custom-phase2-proposals"] = customProposals;
            }else{
                var customProposals = {}
                customProposals["phase2-proposal"]=[];
                phase2Settings["custom-phase2-proposals"] = customProposals;
            }

            if(phase2Settings["idle-time"] == "") {
                phase2Settings["idle-time"] = "60";
            }

            if(phase2Settings["install-time"] == "" || phase2Settings["install-time"] === null) {
               phase2Settings["install-time"] = "0";
            }
            return phase2Settings;
        },

        getViewData : function(){
            if (this.form && this.form.isValidInput()) {
                var results = Syphon.serialize(this);
                data = this.convertViewToData(results);
                console.log(data);
                return data;
            }
        },
         validateForm: function (event) {
            var me = this, el, value = event.target.value, name, removeError = false;
            // get target name
            name = event.target.name;
                if(event.type === "validLifeTime"){
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
                }else if(event.type === "validLifeSize"){
                  el = me.$el.find('.editable[name="life-size"]');
                    if(el.parent().find(".error").length == 0)
                        {
                            el.after("<small class='error errorimage'></small>");
                        }
                    if (value) {
                       if(isNaN(value) === true || value.indexOf(" ") !== -1){
                        el.parent().find(".error").html(this.context.getMessage("enter_numbers_only"));
                      } else{
                        if (value.trim() < 64 || value.trim() > 4294967294) {
                            el.parent().find(".error").html(this.context.getMessage("lifeSize_range"));
                        }
                        else {
                            el.parent().find(".error").remove();
                        }
                       }
                    } else {
                        el.parent().find(".error").remove();
                    }


                }
         }


    });

    return Phase2View;
});
