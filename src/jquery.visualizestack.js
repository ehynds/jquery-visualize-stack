(function($){

	$.fn.visualizeStack = function(options){
		options = $.extend({}, $.fn.visualizeStack.defaults, options);
		
		// filter out elements with no z-index
		var elems = this.filter(function(){
			return $(this).css("z-index") !== "auto";
		}).map(function(i,elem){
			return { element:elem, stack:$(this).css("z-index") };
		}).get().sort(function(a,b){
			return a.stack === b.stack ? 0 : (a.stack < b.stack ? -1 : 1);
		});
		
		// nothing found?  bail.
		if(!this.length || !elems.length){
			return this;
		}
		
		// default the lastColor and lastStack to the first in each array
		var lastColor = 90, 
			lastStack = elems[0]['stack'],
			startHue = /\w/.test(options.color) ? $.fn.visualizeStack.colors[options.color] : options.color;

		// figure out how many unique z-index there are
		var uniqueStacks = (function(){
			var stacks = $.map(elems, function(obj){ return obj.stack; }), uniques = [];
			
			$.each(stacks, function(i,val){
				if($.inArray(val, uniques) === -1){
					uniques.push(val);
				}
			});
			
			return uniques.length;
		})();
			
		$.each(elems, function(i, obj){
			var $element = $(obj.element),
				color = lastColor = (obj.stack === lastStack) 
					? lastColor 
					: lastColor-(100/uniqueStacks);

			// loop through the css props to add
			$.each(options.properties, function(prop, val){
				$element.css(prop, val.replace("%", "hsl("+startHue+",100%,"+color+"%)") );
				
				// change the text color when the color becomes to dark
				if(options.invertTextColor.length && lastColor <= 50){
					$element.css("color", options.invertTextColor);
				}
			});
			
			// remember what the last z-index was
			lastStack = obj.stack;
		});

		return this;
	};

	$.fn.visualizeStack.colors = {
		red: 360,
		blue: 240,
		turquoise: 180,
		green: 120,
		yellow: 60
	};
	
	$.fn.visualizeStack.defaults = {
		color: "red",
		properties: {
			"background": "%"
		},
		invertTextColor: "#fff"
	};

})(jQuery);
