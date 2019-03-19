const Sauce = require('../models/sauce');

var fs = require('fs');


exports.getAll = (req,res,next)=>{
    Sauce.find().then(
        (sauces=>{
            res.status(200).json(sauces);
        })
    ).catch((err=>{
        res.status(404).error(err);
    }));
}

exports.getOne = (req,res,next)=>{
    Sauce.findOne({_id: req.params.id}).then(
        (sauce)=>{
            if(!sauce){
                res.status(404).json({
                    message: 'Invalide Sauce'
                });
            }
            res.status(200).json(sauce);
        }
    ).catch(
        (err)=>{
            res.status(404).error(err);
        }
    );
}

exports.saveOne = (req,res,next)=>{
    
    req.body.sauce = JSON.parse(req.body.sauce);

    const url = req.protocol+ '://'+req.get('host');

    let sauce = new Sauce({
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        imageUrl : url+'/images/'+req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
        heat : req.body.sauce.heat,
        userId: req.body.sauce.userId
    });

    sauce.save().then(
        ()=>{
            res.status(200).json({
                message: 'Saved successfully'
            });
        }
    ).catch((err)=>{
        res.status(404).error(err);
    });
    
}   

exports.updateOneThing = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });

    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      req.body.sauce = JSON.parse(req.body.sauce);
      sauce = {
        _id: req.params.id,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        imageUrl: url+'/images/'+req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
        heat : req.body.sauce.heat,
        userId: req.body.sauce.userId
      };
    } else {
        console.log(req.body);
    
      sauce = {
        _id: req.params.id,
        name: req.body.name,
        manufacturer: req.body.manufacturer,
        description: req.body.description,
        imageUrl  : req.body.imageUrl,
        mainPepper: req.body.mainPepper,
        heat : req.body.heat,
        userId: req.body.userId
      };
    }
    Sauce.updateOne({_id: req.params.id}, sauce).then(
      () => {
        res.status(201).json({
          message: 'Sauce updated successfully!',
          request : req.body,
          sauce: sauce
        });
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  }


exports.deleteOne = (req,res,next)=> {

    Sauce.findOne({_id: req.params.id}).then(
        (sauce)=>{
            let filePath = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/'+filePath, ()=>{
                Sauce.deleteOne({_id: req.params.id}).then(
                    ()=>{
                        res.status(200).json({
                            message: 'Deleted Successfully'
                        });
                    }
                ).catch((err)=>{
                    res.status(404).error(err);
                });
            });
        }
    ).catch((err)=>{
        res.status(404).error(err);
    });
}

exports.likeSauce =(req,res,next)=>{
    Sauce.findOne({_id: req.params.id}).then(
        (sauce)=>{
            if(!sauce){
                res.status(404).json({
                    message: 'Invalide Sauce'
                });
            }

            let like  = req.body.like;
            let user = req.body.userId;

            let userInLiked = sauce.usersLiked.includes(user);
            let userInDisLiked = sauce.usersDisliked.includes(user);

             //Checks if the user liked the sauce
             if(like == 1){
                //Removes users from the list of diskLike sauce array
                if(userInDisLiked){
                    var index = sauce.usersDisliked.indexOf(user);
                    sauce.usersDisliked.splice(index,1);
                    //sauce.dislikes =- 1; //Decrements the dislikes 
                }
                if(!userInLiked){
                    sauce.usersLiked.push(user);
                    //sauce.likes =+ 1;
                }
                
            }else if(like == -1){
                if(userInLiked){
                    var index = sauce.usersLiked.indexOf(user);
                    sauce.usersLiked.splice(index,1);
                    //sauce.likes =- 1; //Decrements the likes 
                }
                if(!userInDisLiked){
                    sauce.usersDisliked.push(user);
                    //sauce.dislikes =+ 1;
                }
            }else {
                if(userInLiked){
                    var index = sauce.usersLiked.indexOf(user);
                    sauce.usersLiked.splice(index,1);
                    //sauce.likes =- 1; //Decrements the likes 
                }
                if(userInDisLiked){
                    var index = sauce.usersDisliked.indexOf(user);
                    sauce.usersLiked.splice(index,1);
                }
            }

            //Getting the number of user who like and dislike the sauce
            sauce.likes = sauce.usersLiked.length; 
            sauce.dislikes = sauce.usersDisliked.length;

            sauce.save().then(
                ()=>{
                    res.status(200).json({
                        message: 'Saved successfully'
                    });
                }
            ).catch((err)=>{
                res.status(404).error(err);
            });
            // res.status(200).json({
            //     sauce: sauce,
            //     like: like,
            //     userId: user,
            //     likes: userInLiked,
            //     dislikes: userInDisLiked
            // });
        }
    ).catch(
        (err)=>{
            res.status(404).error(err);
        }
    );
}
