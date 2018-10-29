import fileinput
import re
import os

def doHTML ():
    for line in content:
        #check if the line contains json, js or html. If yes the split it by comma. On each items of split perform the processing
        #In the end join back all tokens
        if("text!" in line and (".html" in line or ".json" in line) or ".js" in line):
            lineItems = line.split(",")
            newItems = []
            for module in lineItems :


                if ("text!" in module and ".html" in module and "widgets" not in module):
                    toReplace = module.split("text!")[1].split(".html")[0] + ".html"
                    htmlFilePath = subdir + os.sep + toReplace
                    print ("<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>")
                    # print(htmlFilePath)
                    # print(os.path.abspath(htmlFilePath))
                    absFilePath = os.path.abspath(htmlFilePath)
                    modulePath = absFilePath.replace("/home/skesarwani/secmgt/ui/plugins",
                                                     "slipstream.installed_plugins")
                    print (toReplace)
                    print (modulePath)
                    module = module.replace(toReplace, modulePath);
                    print ("<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>")
                elif ("text!" in module and ".json" in module and "widgets" not in module):
                    toReplace = module.split("text!")[1].split(".json")[0] + ".json"
                    htmlFilePath = subdir + os.sep + toReplace
                    print ("<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>")
                    # print(htmlFilePath)
                    # print(os.path.abspath(htmlFilePath))
                    absFilePath = os.path.abspath(htmlFilePath)
                    modulePath = absFilePath.replace("/home/skesarwani/secmgt/ui/plugins",
                                                     "slipstream.installed_plugins")
                    print (toReplace)
                    print (modulePath)
                    module = module.replace(toReplace, modulePath);
                    print ("<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>")
                elif (".js" in module and ".json" not in module and  "'" in module and not (module.split("'")[1].startswith("widgets/"))):

                    toReplace = module.split("'")[1].split(".js")[0]
                    htmlFilePath = subdir + os.sep + toReplace
                    print ("<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>")
                    # print(htmlFilePath)
                    # print(os.path.abspath(htmlFilePath))
                    absFilePath = os.path.abspath(htmlFilePath)
                    modulePath = absFilePath.replace("/home/skesarwani/secmgt/ui/plugins",
                                                     "slipstream.installed_plugins")
                    print (toReplace)
                    print (modulePath)
                    module = module.replace(toReplace+ ".js", modulePath);
                    print ("<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>")
                elif (".js" in module and ".json" not in module and  "\"" in module and not (module.split("\"")[1].startswith("widgets/"))):

                    toReplace = module.split("\"")[1].split(".js")[0]
                    htmlFilePath = subdir + os.sep + toReplace
                    print ("<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>")
                    # print(htmlFilePath)
                    # print(os.path.abspath(htmlFilePath))
                    absFilePath = os.path.abspath(htmlFilePath)
                    modulePath = absFilePath.replace("/home/skesarwani/secmgt/ui/plugins",
                                                     "slipstream.installed_plugins")
                    print (toReplace)
                    print (modulePath)
                    module = module.replace(toReplace+ ".js", modulePath);
                    print ("<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>")

                newItems.append(module);

            line = ','.join([str(x) for x in newItems])
            f2.write(line)
        else:
            f2.write(line)



indir = "/home/skesarwani/secmgt/ui/plugins/"
for subdir, dirs, files in os.walk(indir):
    for file in files:
        filepath = subdir + os.sep + file

        if filepath.endswith(".js"):
            #print (filepath)


            with open(filepath, 'r') as f1:
                content = f1.readlines()
            f1.close()
            f2 = open(filepath, 'w')
            doHTML()

            f2.close();










