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

		if (attributes.name.length > 40) {
			return new Error('Name can consist of fourty characters at most');
		}
	}
});

TODO.ItemView = Backbone.View.extend({
	initialize: function () {
		this.model.on('change', this.update, this);
	},

	events: {
		'click input[type=checkbox]': 'onCheckboxClick'
	},

	onCheckboxClick: function () {
		this.model.set('done', this.$checkbox.is(':checked'));		
	},

	renderCheckbox: function () {
		this.$checkbox = $('<input type="checkbox" />');
		this.$el.append(this.$checkbox);
	},

	renderName: function () {
		this.$name = $('<p class="name"></p>');
		this.$el.append(this.$name);
	},

	update: function () {
		this.$name.html(this.model.get('name'));
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
		this.update();
		this.delegateEvents();
	}
});

TODO.Items = Backbone.Collection.extend({
	model: TODO.Item
});

TODO.ItemsView = Backbone.View.extend({
	initialize: function () {
		this.views = [];
		
		_(this.collection.models).each(this.addView, this);

		this.collection.on('add', function (model) {
			this.addView(model);
			this.renderViews();
		}, this);
	},

	addView: function (model) {
		this.views.push(new TODO.ItemView({
			model: model,
			tagName: 'li'
		}));
	},

	onSubmit: function (event) {
		event.preventDefault();

		var model = new TODO.Item({
			name: this.$input.val()
		});

		if (model.isValid()) {
			this.collection.add(model);
			this.$input.val('');
		}
	},

	renderViews: function () {
		this.$container.empty();
		_(this.views).each(this.renderView, this);
	},

	renderView: function (view) {
		this.$container.append(view.$el);
		view.render();
	},

	renderContainer: function () {
		this.$container = $('<ul></ul>');
		this.$el.append(this.$container);
	},

	renderNewItemForm: function () {
		this.$newItemForm = $('<form />');
		this.$input = $('<input type="text" />');
		this.$newItemForm.append(this.$input);
		this.$newItemForm.append('<button type="submit">Add</button>');
		this.$el.append(this.$newItemForm);
		this.$newItemForm.bind('submit', _.bind(this.onSubmit, this));
	},

	render: function () {
		this.renderNewItemForm();
		this.renderContainer();
		this.renderViews();
	}
});