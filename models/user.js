const mongoose=require('mongoose');

const helperschema=new mongoose.Schema({


name:{

type:String

},

email:{

    type:String
    
    },

    password:{

    type:String
    
    },
    select:{

        type:String
        
        },
        file:{

            type:String
            
            }
            
        
    

})
module.exports=mongoose.model('helpersignup', helperschema);

