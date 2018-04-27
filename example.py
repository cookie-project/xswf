import swiffas
from swiffas import swftags
import random

# parse the SWF file
p = swiffas.SWFParser ()
with open ('tests/DofusInvoker.swf', 'rb') as f:
    p.parse (f)

#print('has', p.properties.frame_count, 'frames')
#print('has', len(p.record_headers), 'records; parsed', len(p.tags), 'of them')

# get each exported AS3 program in the SWF file
as3_exports = filter (lambda x: isinstance (x, swftags.DoABC), p.tags)
#print('get as3 exports')
# print some information about them
for as3_export in as3_exports:
    as3 = swiffas.ABCFile (as3_export.bytecode)

    for method in as3.methods:
        method_name = as3.constant_pool.strings[method.name].value
        if "deserializeAs_" in method_name:
            print(method_name)
            if hasattr(method, 'param_names'):
                for param in method.param_names:
                        print(param)
            print("")

    #print(as3_export.name, 'has', as3.methods[0].param_names, 'methods')

    # print all the strings used in the program
    #print('\n'.join (map (lambda sinfo: sinfo.value, as3.constant_pool.strings)))