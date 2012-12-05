TODO = {};

TODO.Item = Backbone.Model.extend({
	defaults: {
		name: '',
		done: false
	},

	validate: function (attributes) {
		if (attributes.name.length < 3) {
			return new Error('Name must consist of three or more characters');			
		}

		if (attributes.name.length > 20) {
			return new Error('Name can consist of twenty characters at most');
		}
	}
});

TODO.ItemView = Backbone.View.extend({
	initialize: function () {
		this.model.on('change:done', this.renderState, this);
	},

	events: {
		'click input[type=checkbox]': 'onCheckboxClick'
	},

	onCheckboxClick: function (event) {
		this.model.set('done', this.$checkbox.is(':checked'));
	},

	renderCheckbox: function () {
		this.$checkbox = $('<input type="checkbox" />'); 
		this.$el.append(this.$checkbox);
	},

	renderName: function () {
		this.$name = $('<p class="name">' + this.model.get('name') + '</p>');
		this.$el.append(this.$name);
	},

	renderState: function () {
		if (this.model.get('done')) {
			this.$checkbox[0].checked = true;
			this.$el.addClass('done');			
		} else {
			this.$checkbox[0].checked = false;
			this.$el.removeClass('done');
		}
	},

	render: function () {
		this.$el.empty();
		this.renderCheckbox();
		this.renderName();
		this.renderState();
	}
});

TODO.Items = Backbone.Collection.extend({
	model: TODO.Item
});

TODO.ItemsView = Backbone.View.extend({
	initialize: function () {
		this.views = [];
		this.collection.each(this.addView, this);
		this.collection.on('add', function (model) {
			this.addView(model);
			this.render();
		}, this);
	},

	addView: function (model) {
		this.views.push(new TODO.ItemView({
			tagName: 'li',
			model: model
		}));
	},

	renderViews: function () {
		this.$itemContainer.empty();
		_(this.views).each(function (view) {
			this.$itemContainer.append(view.$el);
			view.render();
		}, this);
	},

	render: function () {
		this.$el.empty();
		this.$itemContainer = $('<ul></ul>');
		this.$newItemForm = $('<form></form>');
		this.$newItemForm.append('<input type="text" />');
		this.$newItemForm.append('<button type="submit" />');
		this.renderViews();
	}
});