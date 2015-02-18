(function(){

  var Toot = Backbone.Model.extend({
    idAttribute: "_id",

    defaults: function(attributes){
      attributes = attributes || {};
      return _.defaults(attributes, {
        body: '',
        username: '<no user>',
        timestamp: (new Date()).toString()
      });
    }
  });

  var TootsCollection = Backbone.Collection.extend({
    url: 'http://tiny-pizza-server.herokuapp.com/collections/toots',
    model: Toot,

    comparator: 'timestamp'
  });

  var TootInputView = Backbone.View.extend({
    el: '.js-toot-input',

    events: {
      'submit': 'createToot'
    },

    createToot: function(event){
      event.preventDefault();
      var body = this.$('.js-new-toot').val();
      this.collection.create({body: body, username: username});
      this.$('.js-new-toot').val('');
    }
  });

  var TootItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'toot',
    template: _.template($('#toot-template').text()),

    events: {
      'click .js-destroy': 'destroyToot',
      'click .js-edit': 'editToot',
    },

    render: function(){
      this.$el.html( this.template( this.model.toJSON() ) );
    },

    destroyToot: function(){
      this.model.destroy();
    },

    editToot: function(){
      var editable = this.$('.js-body').attr('contenteditable') == 'true';
      if(editable) {
        this.$('.js-body').attr('contenteditable', 'false');
        this.model.set('body', this.$('.js-body').text() );
        this.model.save();
      } else {
        this.$('.js-body').attr('contenteditable', 'true');
      }
    }
  });

  var TootsListView = Backbone.View.extend({
    el: '.js-toots',

    initialize: function(){
      this.listenTo(this.collection, 'destroy sync', this.render);
    },

    render: function(){
      var self = this;

      this.$el.empty();

      this.collection.each(function(toot){
        var itemView = new TootItemView({model: toot});
        itemView.render();
        self.$el.append(itemView.el);
      });

      return this;
    }
  });

  $(document).ready(function(){
    Backbone.history.start();
  });

})();
