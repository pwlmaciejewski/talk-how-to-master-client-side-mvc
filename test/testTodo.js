module('Item test case', {
	setup: function () {
		this.item = new TODO.Item({
			name: 'foo',
			done: true
		});
	}
});

test('Item instance', function () {
	equal(typeof this.item, 'object');
});

test('Item default attributes', function () {
	deepEqual((new TODO.Item()).toJSON(), {
		name: '',
		done: false	
	});
});

test('Test initialization (we propably shouldnt do that)', function () {
	equal(this.item.get('name'), 'foo');
});

test('Validation name minimum length', function () {
	var spy = sinon.spy();
	this.item.on('error', spy);
	this.item.set('name', 'x');
	ok(spy.called);
	equal(spy.firstCall.args[1].message, 'Name must consist of three or more characters');
});

test('Validation name maximum length', function () {
	var spy = sinon.spy();
	this.item.on('error', spy);
	this.item.set('name', '123456789012345678901');
	ok(spy.called);
	equal(spy.firstCall.args[1].message, 'Name can consist of twenty characters at most');
});

module('ItemView test case', {
	setup: function () {
		this.item = new TODO.Item({
			name: 'foo'
		});

		this.itemView = new TODO.ItemView({
			model: this.item
		});

		this.itemView.render();
	}
});

test('It renders checkbox', function () {
	var input = this.itemView.$el.find('input[type=checkbox]');
	equal(input.length, 1);
});

test('It has $checkbox property', function () {
	ok('$checkbox' in this.itemView);
});

test('It renders name in p.name', function () {
	var name = this.itemView.$el.find('p.name');
	equal(name.length, 1);
	equal(this.itemView.$name[0], name[0]);
});

test('Render reflects the model state', function () {
	this.item.set('done', true, { silent: true });
	this.itemView.render();
	ok(this.itemView.$checkbox.is(':checked'));
});

test('Checkbox state propagate', function () {
	this.item.set('done', true);
	ok(this.itemView.$checkbox.is(':checked'));
});

test('It has done class', function () {
	ok(!this.itemView.$el.hasClass('done'));
	this.item.set('done', true);
	ok(this.itemView.$el.hasClass('done'));
});

test('Changes done state on input click', function () {
	this.itemView.$checkbox[0].checked = true;
	this.itemView.$checkbox.trigger('click');
	ok(this.item.get('done'));
});

module('ItemsView test case', {
	setup: function () {
		this.items = new TODO.Items([{
			name: 'foo'
		}, {
			name: 'bar'
		}]);

		this.itemsView = new TODO.ItemsView({
			collection: this.items
		});

		this.itemsView.render();
	}
});

test('It creates views', function () {
	equal(this.itemsView.views.length, 2);
});

test('It renders views in $itemContainer as li', function () {
	equal(this.itemsView.$itemContainer.find('li').length, 2);
});

test('It renders view on collection add event', function () {
	this.items.add({
		name: 'baz'
	});
	equal(this.itemsView.$itemContainer.find('li').length, 3);
});

test('It renders $newItemForm with input and aubmit button', function () {
	equal(this.itemsView.$newItemForm.find('input[type=text]').length, 1);
	equal(this.itemsView.$newItemForm.find('button[type=submit]').length, 1);
});
