(function($){

$.fn.visualizeStack = function(options){
	options = $.extend({}, $.fn.visualizeStack.defaults, options);

	// We only want to keep elements that have a legitimate z-index.
	// If this plugin is called like $("div").visualizeStack(), for 
	// example, not all divs in that selection could have a set z-index.
	//
	// Because the default z-index property value is "auto" we can
	// safely assume a z-index was set if the value is numeric
	var elems = this.filter(function(){
		return /^-?\d+$/.test( $(this).css("z-index") );
	})

	// Take those filtered elements and return an array of objects.  The 
	// "element" key will be a DOM element, and the "stack" key 
	// will be the z-index.  
	//
	// Ultimately we want to create an array sorted in order of 
	// z-indexes, from lowest to hightest. But, we also need 
	// to remember which element had which z-index; an array of just 
	// z-indexes or just elements does not help us. 
	.map(function(){
		return { element:this, stack:parseFloat($(this).css("z-index")) };
	})

	// Turn this mapped jQuery object into a pure-javascript array of 
	// objects.  If we didn't call get(), we would still be working
	// with a jQuery object of object literals.
	.get()

	// Finally, sort the array ascending based on the "stack" property 
	// of the object.  Returning 0, -1, or 1 in sort() determines where
	// to place the array item.
	.sort(function(a,b){
		return a.stack === b.stack ? 0 : (a.stack < b.stack ? -1 : 1);
	});
	
	
	// nothing found?  bail.
	if(!this.length || !elems.length){
		return this;
	}
	
	// the last "lightness" number will be recorded here.  We'll start with 90.
	var lastColor = 90, 

		// the last z-index level will be recorded here.  Start with the first
		// z-index in our elems array, or the lowest z-index.
		lastStack = elems[0]['stack'],
	
		// To define the gradient spectrum color, users can either pass in a 
		// name of a color (like red) OR a starting hue color.  If the user
		// passed in a name, lookup it's hue value in $.fn.visualStack.colors.
		// otherwise, use the number.  I'm making an assumption users will read
		// the docs and don't try to enter the name of an unsupported color.
		startHue = /\w/.test(options.color) ? $.fn.visualizeStack.colors[options.color] : options.color;

	// figure out how many unique z-index there are
	var uniqueStacks = (function(){

		// where we'll store the unique z-indexes
		var uniques = [];

		$.each(elems, function(i,obj){
			if($.inArray(obj.stack, uniques) === -1){
				uniques.push(obj.stack);
			}
		});

		return uniques.length;
	})();

	
	// loop through the array of objects
	$.each(elems, function(i, obj){
	
		// jQuerify our element
		var $element = $(obj.element),
	
			// determine the lightness value.  if this z-index
			// is the same as the last z-index, use the last lightness
			// value.  otherwise, create a new, darker shade
			color = lastColor = (obj.stack === lastStack) 
				? lastColor 
				: lastColor-(100/uniqueStacks);

		// loop through the CSS properties to add
		$.each(options.properties, function(prop, val){
		
			// replace the percent sign in the property value with the
			// hsl() color.  "background-color: %" will become
			// "background-color: hsl(h, s, l)"
			$element.css(prop, val.replace("%", "hsl("+startHue+",100%,"+color+"%)") );
		
			// change the text color property when the shade becomes 
			// too light or too dark to read
			if(options.lightTextColor.length && lastColor <= 50){
				$element.css("color", options.lightTextColor);
			} else if(options.darkTextColor.length && lastColor >= 50){
				$element.css("color", options.darkTextColor);
			}

		});
	
		// remember what the last z-index value was
		lastStack = obj.stack;
	});

	return this;
	
}; // close $.fn.visualizeStack

$.fn.visualizeStack.colors = {
	red: 360,
	purple: 300,
	blue: 240,
	turquoise: 180,
	green: 120,
	orange: 35,
	yellow: 60
};

$.fn.visualizeStack.defaults = {
	color: "red",
	properties: {
		"background": "%"
	},
	lightTextColor: "",
	darkTextColor: ""
};

// close the wrapping closure, passing in jQuery so $ can be used
// inside the plugin without any conflicts
})(jQuery);
