Basic Slider
------------

```javascript
	new Slider({
		container: document.getElementById('container'),
		initPerct: 0.7,
		onChange: function(value) {
			document.getElementById('value').textContent = value;
		}
	});	
```
