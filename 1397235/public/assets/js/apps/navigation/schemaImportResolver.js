/** 
 * A module that implements a class for resolving navigation schema imports.  
 *
 * Schema imports are specified in a schema file using the 'imports' attribute:
 *
 *  {
 *       imports: [
 *           "foo",
 *           "bar"   
 *       ],
 *       elements: [
 *           { ... }
 *       ]
 *  }
 *
 * Note that when specifying imports the schema elements must be defined within an 'elements' attribute.
 *
 * Two schemas can be merged to form a single aggregate schema.
 *
 * This schema:
 *
 * +---------+---------+---------+
 * |    p1   |    p2   |   p3    |
 * *---------+---------+---------+
 *      |         |               
 *      c1        c1              
 *     /  \      / | \
 *    c2   c3   c2 c3 c4           
 *
 *
 * Merged with this schema:
 *                                    
 *
 * +---------+
 * |    p1   | 
 * *---------+
 *      |                        
 *      c1                     
 *     /         
 *    c2     
 *   /
 *  d1
 *
 * results in this schema:
 *
 *
 * +---------+---------+---------+
 * |    p1   |    p2   |   p3    |
 * *---------+---------+---------+
 *      |         |               
 *      c1        c1              
 *     /  \      / | \
 *    c2   c3   c2 c3 c4    
 *   /
 *  d1  
 *
 * Note that a schema merge operation is always additive i.e. schema elements in one schema never replace or remove schema elements in another schema
 * during a merge operation.
 * 
 * @module 
 * @name schemaImportResolver
 * @author Andrew Chasin <achasin@juniper.net>
 * @copyright Juniper Networks, Inc. 2017
 */     

 define(['underscore'], function(_) {
    /**
     * Construct a SchemaImportResolver
     *
     * @param {String} basePath - The base path at which to resolve imported schemas.
     */
    function SchemaImportResolver(basePath) {
        /**
         * Resolve any schema imports defined in the schema for a context
         *
         * @param {Array<Object>} schema - The set of elements defined in the schema.
         * @param {Array<String>} imports - The paths to the schema import resources.
         * @param {Function} callback - A function to be called after the imports have been resolved.
         */
        this.resolveImports = function(schema, imports, callback) {
            // normalize import paths relative to the configuration directory
            var normalizedImports = imports.map(function(imp) {
                return basePath + imp;
            });

            var resolvedSchema = _.values($.extend(true, {}, schema)); // deep clone the base schema

            /**
             * The imported schema names are normalized to
             * full paths so that they can be consumed by requireJS.  For example, an
             * element of the normalizedImports array might look like this:
             *
             * /assets/js/conf/navigation/import1.js
             */
            require(normalizedImports, function() {
                var importedSchemas = arguments;

                if (importedSchemas) {
                    // convert the arguments to an array for processing via Array operations
                    importedSchemas = Array.prototype.slice.call(importedSchemas);

                    // Ensure that there are no nested imports
                    importedSchemas.forEach(function(importedSchema) {
                        if (importedSchema.imports) {
                            throw new Error("Nested schema imports are not allowed");
                        }

                        if (importedSchema.elements) {
                            importedSchema = importedSchema.elements;
                        }

                        importedSchema.forEach(function(importedSchemaElement) {
                            mergeSchemas(resolvedSchema, importedSchema);
                        });
                    });
                }

                callback(resolvedSchema);
            });  
        }

        /**
         * Merge two navigation schemas
         *
         * @param {Array<Object>} targetSchema - The target schema for the merge operation.
         * @param {Array<Object>} sourceSchema - The source schema for the merge operation
         *
         * @return The resultant merged schema.
         *
         * Note: The targetSchema will be modified by this operation.
         */
        function mergeSchemas(targetSchema, sourceSchema) {
            if (sourceSchema) {
                sourceSchema.forEach(function(sourceElement) {
                    var foundElement = _.findWhere(targetSchema, {"name": sourceElement.name});

                    if (foundElement) {
                        if (!foundElement.children) {
                            if (sourceElement.children) {
                                /**
                                 * Target element has no children at this node level but the target element does.
                                 * Therefore just assign the source children to the target node.
                                */
                                foundElement.children = sourceElement.children;
                            }
                        }
                        else {
                            mergeSchemas(foundElement.children, sourceElement.children);
                        }
                    }
                    else {
                        targetSchema.push(sourceElement);
                    }
                });
            }
           
            return targetSchema;
        }    
    }

    return SchemaImportResolver;
 });  
        