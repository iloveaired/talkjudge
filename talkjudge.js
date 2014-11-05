Talks = new Meteor.Collection("talks");


Meteor.methods({
  upvote : function (talkId){
    var talk  = Talks.findOne(talkId);
    Talks.update(
      talkId,
      {$set: {votes : talk.votes + 1}}
     );
  },
  downvote : function (talkId){
    var talk  = Talks.findOne(talkId);
    Talks.update(talkId,
      {$set: {votes : talk.votes - 1}}
     );
  },
  del : function (talkId){
    Talks.remove({ _id: talkId});

  }
  


});

if (Meteor.isClient) {

  Meteor.subscribe("talks");
  Template.talksList.talks = function (){
    return Talks.find({}, {sort: {votes: -1}});
  },

  Template.talksList.events({
    "click .upvote" : function(){
      Meteor.call("upvote", this._id);
    },
    "click .downvote" : function(){
      Meteor.call("downvote", this._id);
    },
    "click .del" : function(){
      Meteor.call("del", this._id);
    }
  });
  Template.newTalk.events({
    "submit .newTalkForm": function(evt){
      evt.preventDefault();
      Talks.insert({
        title: $(".title").val(),
        speaker: $(".speaker").val(),
        votes: 0
      }, function(err){
        if(! err){
          $("input[type=text]").val();
        }
      });
    }
  });


} else if (Meteor.isServer) {
  var fs = Npm.require('fs');

  Talks.allow({
    insert: function(userId,talk){
      return talk.votes === 0;
    }
  });

  Meteor.publish("talks", function(){
    return Talks.find();
  });
}