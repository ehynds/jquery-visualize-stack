# jQuery Visualize Stack

This plugin apply various shades of a color to elements stacked with z-index in order of their z-index level.  Useful if you have multiple
widgets/elements stacked on top of each other and need to quickly visualize their stack positions.  Elements with the same z-index receive
the same shading color.

At the moment this plugin only works on browsers that support CSS3 hsl() styling.  Sorry, IE.

![Example](http://dl.dropbox.com/u/102001/web/visualize_stack.png)

## Usage

Call the visualizeStack() method on a jQuery object.  The plugin will internally filter and only apply logic to the elements with a numerical z-index, either positive or negative.

	$(function(){
		
		// the logic will only apply to div and p elements in this example.  use $("*") for all elements.
		$("div, p").visualizeStack({
	
			// CSS rules to apply.  the percent sign (%) is replaced with the appropriate color shade.
			properties: {
				background: "%",
				border: "1px solid black"
			},
		
			// the base color of the gradients.  Enter one of the following colors, or a hue number for hsl().
			// accepted color names: red, purple, blue, turquoise, green, orange, and yellow.
			color: "red",
		
			// a hex color to apply to very lightly/darkly shaded elements.  the "color" property of these
			// elements will be set to this value.  pass an empty string to disable.
			lightTextColor: "#fff",
			darkTextColor: "#000"
		});
	
	});

