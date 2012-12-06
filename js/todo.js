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

		if (attributes.name.length > 50) {
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
		this.delegateEvents();
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

	onSubmit: function (event) {
		event.preventDefault();
		var model = new TODO.Item({
			name: this.$input.val()
		});

		if (model.isValid()) {
			this.collection.add({ 
				name: this.$input.val() 
			});
			this.$input.val('');			
		}
	},

	addView: function (model) {
		this.views.push(new TODO.ItemView({
			tagName: 'li',
			model: model
		}));
	},

	renderViews: function () {
		_(this.views).each(function (view) {
			this.$container.append(view.$el);
			view.render();
		}, this);
	},

	renderContainer: function () {
		this.$container = $('<ul></ul>');
		this.$el.append(this.$container);
	},

	renderInputForm: function () {
		this.$newItemForm = $('<form></form>');
		this.$input = $('<input type="text" />');
		this.$newItemForm.append(this.$input);
		this.$submitButton = $('<button type="submit" />');
		this.$submitButton.html('Add');
		this.$newItemForm.append(this.$submitButton);
		this.$el.append(this.$newItemForm);
	},

	render: function () {
		this.$el.empty();
		this.renderInputForm();
		this.renderContainer();
		this.renderViews();
		this.$newItemForm.bind('submit', _.bind(this.onSubmit, this));
	}
});