/*
creates any extra function that might be needed to print the object on screen. 
printObj and printArray for rendering as HTML text
printObjPlain and printArrayPlain for rendering plain text in text area
makeJSON and makeJSONArray for making JSON object out of a object. Not being used currently
*/
define([
], function () {

    

    var ExtraFunctions = function () {
        this.printFunc =function(f,ind=0){
            //complete this
        };
        /* returns a string with array and proper intendation. 
        in: array and intendation (0 by default)
        out: a html string 
        */
        this.printArray = function(arr,ind = 0){
            var str ='';
                //empty array
                if(arr.length ==0){
                    //str+= '<span class="small-space"></span>'.repeat(ind);
                    str += '[]';
                }//non empty array
                else{
                    //str+= '<span class="small-space"></span>'.repeat(ind);
                    str+= '['
                    for(var ii=0; ii< arr.length; ii++) {
                        if(ii == arr.length -1){
                            if(typeof arr[ii] == 'string'){
                                str+= '"'+arr[ii]+'"'
                            }else if(typeof arr[ii] == 'number'){
                                str+= arr[ii]
                            }
                            else if(typeof arr[ii]== 'object'){
                                //array of arrays ----this part is needs to be refined to print arrays correctly
                                if(Object.prototype.toString.call( arr[ii]) === '[object Array]'){
                                    str+= '<br>' +'<span class="small-space"></span>'.repeat(ind)+ this.printArray(arr[ii], ind +1) ;
                                }
                                //array of nulls
                                else if(!arr[ii]){
                                    str+= 'null';
                                }
                                //array of objects
                                else{
                                    str+= '<br>{ ' + this.printObj(arr[ii], ind +1) + '}';
                                }
                            }
                        }
                        else{
                            if(typeof arr[ii] == 'string'){
                                str+= '"'+arr[ii]+'",'
                            }else if(typeof arr[ii] == 'number'){
                                str+= arr[ii]+','
                            }else if(typeof arr[ii]== 'object'){
                                //array of arrays ----this part is needs to be refined to print arrays correctly
                                if(Object.prototype.toString.call( arr[ii]) === '[object Array]'){
                                    str+= '<br>' +'<span class="small-space"></span>'.repeat(ind)+ this.printArray(arr[ii],ind +1) + ',';
                                }
                                //array of nulls
                                else if(!arr[ii]){
                                    str+= 'null,';
                                }
                                //array of objects
                                else{
                                    str+= '<br>{ ' + this.printObj(arr[ii], ind +1) + '},';
                                }  
                            }
                        }
                    }
                    str+= ']' // changed last part from '],' to ']' wont be needed untill we have array of arrays. If we do add the n and n-1 part
                }   
            return str;
        };
        /* returns a string with object and proper intendation. 
        in: object and intendation (0 by default)
        out: a html string 
        */
        this.printObj =function(o,ind = 0){
            var str='';
            var first = true;
                for(var p in o){
                    if(!first){
                        str+=","
                    }
                    str+= '<br>';
                    str+= '<span class="small-space"></span>'.repeat(ind);
                    str+= '<span class="bold">'+p + ': </span> '
                    //string
                    if(typeof o[p] == 'string'){
                        str += '"'+ o[p] + '"';
                    }
                    //number
                    else if(typeof o[p] == 'number'){
                        str += o[p];
                    }
                    //boolean
                    else if(typeof o[p] == 'boolean'){
                        if(o[p]){
                            str+= "true";
                        }
                        else{
                            str+= "false";
                        }
                    }
                    else if(typeof o[p] == 'function'){
                        //str+= this.printFunc(o[p],ind+1);
                        str+= o[p];
                    }
                    //object
                    else{
                        //array
                        if(Object.prototype.toString.call( o[p]) === '[object Array]'){
                            str+=this.printArray(o[p],ind+1);
                        }//null
                        else if(!o[p]){
                            str+= 'null';
                        }
                        //real object
                        else{
                            str+=  '{ ' + this.printObj(o[p],ind +1) + '}'; 
                        }
                    }
                    //testing -- uncomment and comment out the flag part if you see problem
                    //if(ind == 0){
                      //  str+= ','; //note - printing after the last property too, must remove
                    //} 
                    first=false;

                }
                //console.log(str);
                return str;
        };
        /* returns array in JSON format. 
        in: Javascript array 
        out: a JSON object
        */
        this.makeJSONArray =function(arr){
            var str ='';
                //empty array
                if(arr.length ==0){
                    //str+= '<span class="small-space"></span>'.repeat(ind);
                    str += '[]';
                }//non empty array
                else{
                    //str+= '<span class="small-space"></span>'.repeat(ind);
                    str+= '['
                    for(var ii=0; ii< arr.length; ii++) {
                        if(ii == arr.length -1){
                            if(typeof arr[ii] == 'string'){
                                str+= '"'+arr[ii]+'"';
                            }else if(typeof arr[ii] == 'number'){
                                str+= arr[ii];
                            }
                            else if(typeof arr[ii]== 'object'){
                                //array of arrays ----this part is needs to be refined to print arrays correctly
                                if(Object.prototype.toString.call( arr[ii]) === '[object Array]'){
                                    str+=  this.makeJSONArray(arr[ii]) ;
                                }
                                //array of nulls
                                else if(!arr[ii]){
                                    str+= 'null';
                                }
                                //array of objects
                                else{
                                    str+= '{ ' + this.makeJSON(arr[ii]) + '}';
                                }
                            }
                        }
                        else{
                            if(typeof arr[ii] == 'string'){
                                str+= '"'+arr[ii]+'",'
                            }else if(typeof arr[ii] == 'number'){
                                str+= arr[ii]+','
                            }else if(typeof arr[ii]== 'object'){
                                //array of arrays ----this part is needs to be refined to print arrays correctly
                                if(Object.prototype.toString.call( arr[ii]) === '[object Array]'){
                                    str+= this.makeJSONArray(arr[ii]) ;
                                }
                                //array of nulls
                                else if(!arr[ii]){
                                    str+= 'null,';
                                }
                                //array of objects
                                else{
                                    str+= '{ ' + this.makeJSON(arr[ii], ind +1) + '},';
                                }  
                            }
                        }
                    }
                    str+= ']' // changed last part from '],' to ']' wont be needed untill we have array of arrays. If we do add the n and n-1 part
                }   
            return str;
        };
        /* returns object in JSON format. 
        in: Javascript object 
        out: a JSON object
        */
        this.makeJSON =function(o){
            var str='{';
            var first = true;
                for(var p in o){
                    if(!first){
                       str+= ','; 
                    }
                    str+= '"'+p + '":'
                    //string
                    if(typeof o[p] == 'string'){
                        str += '"'+ o[p] + '"';
                    }
                    //number
                    else if(typeof o[p] == 'number'){
                        str += o[p];
                    }
                    //boolean
                    // else if(typeof o[p] == 'boolean'){
                    //     if(o[p]){
                    //         str+= "true";
                    //     }
                    //     else{
                    //         str+= "false";
                    //     }
                    // }
                    //dont know how to treat functions for now
                    else if(typeof o[p] == 'function'){
                        //str+= this.printFunc(o[p],ind+1);
                        str+= o[p];
                    }
                    //object
                    else{
                        //array
                        if(Object.prototype.toString.call( o[p]) === '[object Array]'){
                            str+=this.makeJSONArray(o[p]);
                        }//null
                        else if(!o[p]){
                            str+= 'null';
                        }
                        //real object
                        else{
                            str+=  '{ ' + this.makeJSON(o[p]) + '}'; 
                        }
                    }
                        //str+= ','; //note - printing after the last property too, must remove  
                        first = false;
                }
                str+='}'
                return str;
        };
        /* returns a string with array and proper intendation. 
        in: array and intendation (0 by default)
        out: a plain string 
        */
        //in functions suffixed plain replaced span space by 4 space and br by \n (removed span bold)
        this.printArrayPlain = function(arr,ind = 0){
            var str ='';
                //empty array
                if(arr.length ==0){
                    //str+= '<span class="small-space"></span>'.repeat(ind);
                    str += '[]';
                }//non empty array
                else{
                    //str+= '<span class="small-space"></span>'.repeat(ind);
                    str+= '['
                    for(var ii=0; ii< arr.length; ii++) {
                        if(ii == arr.length -1){
                            if(typeof arr[ii] == 'string'){
                                str+= '"'+arr[ii]+'"'
                            }else if(typeof arr[ii] == 'number'){
                                str+= arr[ii]
                            }
                            else if(typeof arr[ii]== 'object'){
                                //array of arrays ----this part is needs to be refined to print arrays correctly
                                if(Object.prototype.toString.call( arr[ii]) === '[object Array]'){
                                    str+= '\n' +'\t'.repeat(ind)+ this.printArrayPlain(arr[ii], ind +1) ;
                                }
                                //array of nulls
                                else if(!arr[ii]){
                                    str+= 'null';
                                }
                                //array of objects
                                else{
                                    str+= '\n{ ' + this.printObjPlain(arr[ii], ind +1) + '}';
                                }
                            }
                        }
                        else{
                            if(typeof arr[ii] == 'string'){
                                str+= '"'+arr[ii]+'",'
                            }else if(typeof arr[ii] == 'number'){
                                str+= arr[ii]+','
                            }else if(typeof arr[ii]== 'object'){
                                //array of arrays ----this part is needs to be refined to print arrays correctly
                                if(Object.prototype.toString.call( arr[ii]) === '[object Array]'){
                                    str+= '\n' +'\t'.repeat(ind)+ this.printArrayPlain(arr[ii],ind +1) + ',';
                                }
                                //array of nulls
                                else if(!arr[ii]){
                                    str+= 'null,';
                                }
                                //array of objects
                                else{
                                    str+= '\n{ ' + this.printObjPlain(arr[ii], ind +1) + '},';
                                }  
                            }
                        }
                    }
                    str+= ']' // changed last part from '],' to ']' wont be needed untill we have array of arrays. If we do add the n and n-1 part
                }   
            return str;
        };
        /* returns a string with object and proper intendation. 
        in: object and intendation (0 by default)
        out: a plain string 
        */
        //testing - printing it like a json
        this.printObjPlain =function(o,ind = 0){
            var str='';
            var first = true;
                for(var p in o){
                    var preCheck = (typeof o[p] == 'function')? true: false//checks if the value in this run is going to be a func, in that case we dont want a pre comma
                    if(!first  && ! preCheck){
                        str+=","
                    }
                    str+= '\n';
                    str+= '\t'.repeat(ind);
                    
                    //string
                    if(typeof o[p] == 'string'){
                        str+= '"'+p + '":  '
                        str += '"'+ o[p] + '"';
                    }
                    //number
                    else if(typeof o[p] == 'number'){
                        str+= '"'+p + '":  '
                        str += o[p];
                    }
                    //boolean
                    else if(typeof o[p] == 'boolean'){
                        str+= '"'+p + '":  '
                        if(o[p]){
                            str+= "true";
                        }
                        else{
                            str+= "false";
                        }
                    }
                    else if(typeof o[p] == 'function'){
                        //we want to not print functions or the property name at all. If in future we have to (or something breaks), uncomment below 2 lines
                        //ideally sanitize obj before even passing to this function so that there are no funcs
                        //str+= '"'+p + '":  '
                        //str+= '"'+o[p]+'"';
                    }
                    //object
                    else{
                        str+= '"'+p + '":  '
                        //array
                        if(Object.prototype.toString.call( o[p]) === '[object Array]'){
                            str+=this.printArrayPlain(o[p],ind+1);
                        }//null
                        else if(!o[p]){
                            str+= 'null';
                        }
                        //real object
                        else{
                            str+=  '{ ' + this.printObjPlain(o[p],ind +1) + '}'; 
                        }
                    }
                    //testing -- uncomment and comment out the flag part if you see problem
                    //if(ind == 0){
                      //  str+= ','; //note - printing after the last property too, must remove
                    //} 
                    first=false;

                }
                //console.log(str);
                return str;
        };
        this.removeFormatting = function(str){
            return str.replace('\n','').replace(' ','');
        };
    };

    return ExtraFunctions;
});
