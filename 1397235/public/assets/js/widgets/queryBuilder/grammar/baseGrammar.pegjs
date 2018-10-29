/**
 * @author Vidushi Gupta <vidushi@juniper.net>
 * @copyright Juniper Networks, Inc. 2017

 * Grammar to solve cases that includes:-
 * Single term - as a valid search term eg: 'test'
 * Field term - contains three parts as: field name, relational opertaor, field value. eg: 'version=1'
 * > Field name - the name of the key as provided in the configuration
 * > Relational operator - operators in between the field name & field value. supported values as: = != < > <= >= 
 * > Field value - value that corresponds to the field name. multiple field values are comma sepertaed. eg: 'version=1,2,3'
 * If field value or single term has spaces in between then they need to be surrounded by the quotes. (OSVersion="term with value")
 * Logical operator -  
 *   - Non-Mandatory between two terms eg: 'test1 test2' | depends on the app config parameter 'implicitLogicOperator' | 'implicitLogicOperator' should have valid logical operator as value
 *   - Mandatory between two terms eg: 'test1 AND test2' | depends on the app config parameter 'implicitLogicOperator' | 'implicitLogicOperator' not defined or has invalid logical operator as value
 * ==========================
 * Input terms, logical operator are validated against the application provided configuration
 * ==========================
 * User Input when successfully parsed will trigger events from Grammar actions that the widget controller will listen to
 *
 */

 {
    //Initilaizer
   var vent = options.dependency.vent; // vent object needed to trigger events

    // Object to keep track of currently edited fieldExpression.
    var fieldExpressionObj = {
      fieldName: '',
      fieldOperator: '',
      fieldValues:[]
    };

    var lastFieldTermObj; // Used for updating with the last xpression for key/value for invalid field expredssion

    // Method to update current field expression
    function updateFieldExpression(state){
      if(!_.isUndefined(state)){
         switch (state.type) {
           case "fieldName":
               fieldExpressionObj.fieldName = state.value;
               fieldExpressionObj.fieldOperator = '';
               fieldExpressionObj.fieldValues = [];
               break;
           case "relationalOperator":
               fieldExpressionObj.fieldOperator = state.value;
               fieldExpressionObj.fieldValues = [];
               break;
           case "fieldValues":
               fieldExpressionObj.fieldValues = state.value;
               break;
         }
       }
      return fieldExpressionObj;
    };

    // Method to create multiple field expression nodes from given field expression that includes comma seperated values.
   function createFieldValuesModel(fieldName, fieldOperator, fieldValues) {
    // This will create model structure for the comma seperated multiple field values from the field term
    // For example - 'version=1,2,3' will have model structure as 'version=1 OR version=2 OR version=3'

    var counter = fieldValues.length - 1;
    var tempModelObject = {};
    var finalModel;

        // Inner Method to create a node object with FieldExpression details
        function getFieldExpressionNode(fieldName, fieldOperator, fieldValue) {
            var node = {
                'type': 'FieldExpression',
                'value': fieldName + fieldOperator + fieldValue,
                'fieldName': fieldName,
                'fieldOperator': fieldOperator,
                'fieldValue': fieldValue,
                'nodes' : [],
                'expression': fieldName + fieldOperator + fieldValue
            }
            return node;
        }

        // Inner Method - to create a node object with BinaryExpression details
        function getBinaryExpressionNode() {
            var node = {
                  'type': 'BinaryExpression',
                  'value': 'OR',
                  'nodes': [],
                  'expression': ''
              }
            return node;
        }

        // Inner Method - used to create the comma seperated expression for field term with multiple values
        function createFieldExpression(fieldName, fieldOperator, leftExpressionValue, rightExpressionValue){
          var expression;
            if(rightExpressionValue == undefined){
              // indicates the fieldValues has only one value - create the expression with single value. eg: 'version=1'
              expression =  fieldName + fieldOperator + leftExpressionValue;
            }else {
                var splitValue = rightExpressionValue.split(",");
                // indicates the fieldValues are comma seperated - hence left value along with & right values are needed for expression.  eg: 'version=1,2,3'
                var rightExpression = '';
                for(var i=0; i < splitValue.length; i++){
                  rightExpression = rightExpression + "," + splitValue[i];
                }
                expression =  fieldName + fieldOperator + leftExpressionValue + rightExpression;
            }
            return expression;
        }

        // Inner Method - This method is used to recursively to create the model for field term containing comma sepertated mutiple field values.
        // Note the calculations for model creation is from highest index of array to lowest index.
        function createModel(latestModel) {
          //recusive method to create the model structure
          for (var i = counter; i >= -1; i--) {

              if (counter < 0) {
                  // no elemnts left to iterate , break condition for recursive method
                  return finalModel;
              } else if (i >= fieldValues.length - 2) {

                  if (i != 0) {
                    // indicates the fieldValues array has more than 1 element - name=1,2
                      tempModelObject = getBinaryExpressionNode(); //get the binary expression node to show two value field expression

                      tempModelObject.nodes[0] = getFieldExpressionNode(fieldName, fieldOperator, fieldValues[i - 1]);  // pick second last value
                      tempModelObject.nodes[1] = getFieldExpressionNode(fieldName, fieldOperator, fieldValues[i]);   // pick last value

                      tempModelObject.expression = createFieldExpression(fieldName, fieldOperator, fieldValues[i-1], fieldValues[i]); //keep the expression updated as comma seperated for multiple field values

                      counter--; // decrease the counter, since two values are been picked from array
                  } else {
                      // indicates the fieldValues array has only 1 element -  name=1
                      tempModelObject = getFieldExpressionNode(fieldName, fieldOperator, fieldValues[i]);
                      tempModelObject.expression = createFieldExpression(fieldName, fieldOperator, fieldValues[i]); //keep the expression updated as per input
                  }
              } else {
                  // when the # of values are more than 2 - the call will be in here - name=1,2,3...
                  tempModelObject = getBinaryExpressionNode(); //get the binary expression node to show more than two field values expression

                  tempModelObject.nodes[0] = getFieldExpressionNode(fieldName, fieldOperator, fieldValues[i]);
                  tempModelObject.nodes[1] = latestModel; //append the created model

                  tempModelObject.expression = createFieldExpression(fieldName, fieldOperator, fieldValues[i], latestModel.expression.split(fieldOperator)[1]); //keep the expression updated as comma seperated for multiple field values
              }

              finalModel = latestModel = JSON.parse(JSON.stringify(tempModelObject));  //update the latest model with newly created model

              counter--; //decrease the counter to iterate remaining values

              createModel(tempModelObject); //recursive function call to prepend the model with any remaining key values
          }
        }

    return createModel(); // call the recursive method that will create the model for the name-values for fieldExpression
  } //End createFieldValuesModel

  function triggerLastFieldTermObj() {
    // Object to keep track of currently edited fieldExpression
    vent.trigger("parser.lastFieldTermObj", lastFieldTermObj);
  }

}  //End Initilaizer

//Grammar rules
start = exp:expression
{
   return exp;
}

expression
  = node:node sp:_* EOF
    {
      //console.log("expression:1");
      sp.length && (node.space = true);
      return node;
    }
  / _+
    {
      //console.log("expression:2");
      expected("Term");
    }   
  / EOF
    {
      //console.log("expression:3");
      expected("Term");
    }
  / _?
    {
      // This rule is needed to catch the incomplete key-value situation e:g: - 'name=' and trigger the needed event
      //console.log("expression:4")
      triggerLastFieldTermObj();
    }

node =
{{#logicMenu.length}} //Grammar based on app provided config
  {{#logicMenu}}
    {{#logical_or_and_not}} or_precedence {{/logical_or_and_not}}
    {{#logical_or_and}} or_precedence {{/logical_or_and}}
    {{#logical_or_not}} or_precedence {{/logical_or_not}}
    {{#logical_and_not}} and_not {{/logical_and_not}}
    {{#logical_and}} and_not {{/logical_and}}
    {{#logical_not}} and_not {{/logical_not}}
     {{#logical_or}} or_only {{/logical_or}}
  {{/logicMenu}}
{{/logicMenu.length}}
{{^logicMenu.length}} //default Grammar - When no logical operator
    or_precedence
{{/logicMenu.length}}

operator_and_not "LogicalOperator" =
{{#logicMenu}}
 {{#AND}} $("AND"i subString_lo:ignore_substring) {{/AND}}
 {{#NOT}} {{#AND}} / {{/AND}}  $("NOT"i subString_lo:ignore_substring)  {{/NOT}}
 {{#OR}} // When only OR is provided but 'And'| 'not' - are not part of config - The grammar breaks - hence completing grammar - so that Grammar does not break.
 {{^AND}} {{^NOT}} $("OR"i subString_lo:ignore_substring) {{/NOT}}{{/AND}}
 {{/OR}}
{{/logicMenu}}
{{^logicMenu}}  //default Grammar - When no logical operator
   "AND"i
 / "NOT"i
{{/logicMenu}}

operator_or "LogicalOperator"
  = $("OR"i subString_lo:ignore_substring)

or_only
  = left:term sp:termSp+ operator:operator_or losp:logicalOperatorSp+ right:or_only
    {
      var node= {
        'type': 'BinaryExpression',
        'value': operator,
        'nodes': []
      };

      node.nodes.push(left);
      node.nodes.push(right);

      node.expression = left.expression + " " + operator + " " + right.expression;

      return node;
    }
  / term

or_precedence
  = left:and_not sp:termSp+ operator:operator_or losp:logicalOperatorSp+ right:or_precedence
    {
      var node= {
        'type': 'BinaryExpression',
        'value': operator,
        'nodes': []
      };

      node.nodes.push(left);
      node.nodes.push(right);

      node.expression = left.expression + " " + operator + " " + right.expression;

      return node;
    }
  / and_not

and_not
  = left:term sp:termSp+ operator:operator_and_not losp:logicalOperatorSp+ right:and_not
    {
      var rightChild = right;

      var node = {
        'type': 'BinaryExpression',
        'value': operator.match(/not/i) != null ? "AND" : operator,
        'nodes': []
       }

      if(operator.match(/not/i) != null){
        // In case of NOT operator create a AST along with BinaryExpression -
        // This is needed since 'NOT' is unary operator & not Binary operator
        // e:g 'A not b' should actually create a structure as 'A and not b'
          var unaryNode= {
            'type': 'UnaryExpression',
            'value': operator,
            'nodes': []
            };

            if(right.type == "BinaryExpression"){
              // remove the extra "BinaryExpression" type from the recived right child.
              // e:g - a not b not c
              var leftChild = right.nodes[0];
              unaryNode.nodes.push(leftChild);
              right.nodes[0] = unaryNode;
              rightChild = right;
            }else{
              // In case of terms - single term | field term | paren term - create a structure along with 'AND' in between operands
              // e:g - 'A not b' should actually create a structure as 'A and not b'
              unaryNode.nodes.push(right);
              unaryNode.expression = operator + " " + right.expression;
              rightChild = unaryNode;
            }
      }

      node.nodes.push(left);
      node.nodes.push(rightChild);

      node.expression = left.expression + " " + operator + " " + right.expression;

      return node;
    }
  / term:term

term
  = ft: fieldTerm
    {
      //console.log("term:1 - fieldTerm"+JSON.stringify(ft));
      var term = {
        'type': 'FieldExpressionGroup',
        'nodes': [ft],
        'expression': ft.expression
      };

      return term;
    }
  / st:singleTerm
    {
      //console.log("term:2");
      var term = {
        'type': 'Literal',
        'value': st,
        'nodes' : [],
        'expression': st,
      };

      return term;
    }
  / pt:parenTerm
    {
      //console.log("term:3");
      var term = {
        'type': 'ParenExpression',
        'value': '()',
        'nodes': []
      };

      var child = pt;
      term.nodes.push(child);
      term.expression = "(" + child.expression + ")";

      return term;
    }

fieldTerm =
{{#filterMenu}}
 fieldName:fieldName_{{index}} sp:_* fieldOperator:relationalOperator_{{index}} rosp:_* fieldValues:fieldValues
    {
      //console.log("fieldTerm:1");
      var fieldValuesModel = createFieldValuesModel(fieldName, fieldOperator, fieldValues);
      return fieldValuesModel;
    }
  {{^last}} / {{/last}}
{{/filterMenu}}

{{#filterMenu}}
fieldName_{{index}} "FieldName" =
  fName:'{{fieldName}}'i subString_lo:ignore_substring
  {
    var fieldNameObj = {
      type: "fieldName",
      value: "{{fieldName}}"
    };

    updateFieldExpression(fieldNameObj);
    return "{{fieldName}}";
  }
{{/filterMenu}}

{{#filterMenu}}
relationalOperator_{{index}} "RelationalOperator" =
  {{#operators}}
    operator:'{{{operator}}}'
    {
      if(_.isArray(operator)){
        operator = operator.join("");
      }
      var relationalOperatorObj = {
        type: "relationalOperator",
        value: operator
      };

      updateFieldExpression(relationalOperatorObj)
      return operator;
    }
    {{^lastOp}} / {{/lastOp}}
  {{/operators}}
{{/filterMenu}}

fieldValues
  = moreFValue: (fValue: fieldTermValue fValueDelimiter:fieldValueDelimiter)* fValue:fieldTermValue
    {
       var valuesArray = [];
       moreFValue.forEach(function (item, index) {
        valuesArray.push(item[0]);
       })
       valuesArray.push(fValue);

       var fieldValuesObj = {
         type:"fieldValues",
         value: valuesArray
       };
       updateFieldExpression(fieldValuesObj);

       return valuesArray;
    }

fieldValueDelimiter
  = "," sp:fieldDelimiterSp*

fieldTermValue "FieldTermValue"
  = unquoted_term
  / quoted_term

singleTerm "SingleTerm"
  = uqTerm:$(!reserved_fieldName unquoted_term)
  / quoted_term

reserved_fieldName =
{{#filterMenu}}
  fName:'{{fieldName}}'i subString_lo:ignore_substring
  {
    // Note : can not use Object.assign to clone the object - ES6 is not supported yet
    lastFieldTermObj = JSON.parse(JSON.stringify(fieldExpressionObj)); // Keep updated with the last field expression - Used in case of incomplete, invalid key expression
  }
  {{^last}} / {{/last}}
{{/filterMenu}}

unquoted_term
  = term:$term_char_unquoted+

quoted_term
  = $('"' term:$term_char_quoted+ '"')

parenTerm 
  = opp:openParen sp:openSpace* node:node+ clsp:closeSpace* clp:closeParen
    {
      return node[0];
    }

openParen "OpenParen" 
  = "(" 

closeParen "CloseParen" 
  = ")"  

term_char_unquoted
  = [^()!=<>", ] //Not allowed characters | space not allowed | caret is part of regex & not part of 'non-allowed' characters

term_char_quoted
  = [^"] //Not allowed characters | space allowed

ignore_substring
  = subString_lo: ![a-zA-Z0-9_] //used to match the substring of logical operators to validate

_ "Space" = [ \t\r\n\f]

openSpace "OpenParenSpace" = _

closeSpace "CloseParenSpace" = _

nodeSp "NodeSpace" = _

termSp "TermSpace" = _

logicalOperatorSp "LogicalOperatorSpace" = _

fieldNameSp "FieldNameSpace" = _

fieldDelimiterSp "FieldDelimiterSpace" = _

relationalOperatorSp "RelationalOperatorSpace" = _

EOF
  = !.