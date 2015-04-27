(function($){


  var Img = Backbone.Model.extend({
    defaults: {
    }
  });

  var Gallery = Backbone.Collection.extend({
    model: Img
  });

  var GalleryView = Backbone.View.extend({
    el: $('.gallery'),
    events: {
      'clickbutton#refresh': 'getNewImages'
    }
  });

  
})