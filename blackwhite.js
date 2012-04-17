(function ($) {
	$.blackwhite = function () {
		var BW = {
			/** 
			 * Array of all the styles
			 * @type {array}
			 */
			stylesheets: document.styleSheets,
			
			/**
			 * Returns array of stylesheet rules 
			 * @param {Object} stylesheet link
			 */
			getRules: function (stylesheet) {
				return stylesheet.cssRules ? stylesheet.cssRules : stylesheet.rules; 
			},
			
			init: function () {
				var self = this;
				this.processColorRules();
				$('img').each(function (indx, el) {
					el.src = self.processImages(el);
				});
			},
			
			/**
			 * Search through all styles and transform color rules
			 */
			processColorRules: function () {
				var rules,
					transcolor;
				for ( var i=0; i < this.stylesheets.length; i++ ) {
					rules = this.getRules( this.stylesheets[i] );
					for ( var k=0; k < rules.length; k++ ) {
						transcolor = this.transformColor(rules[k].style.backgroundColor);
						rules[k].style.backgroundColor = transcolor;
						rules[k].style.color = this.transformColor(rules[k].style.color);
					}
				}
			},
			
			/**
			 * Transform hex color value to grayscale 
			 * @param {string} rgb color in hex
			 * @returns {string} grayscale color code, transformed to grayscale
			 */
			transformColor: function (rgb) {
				var grayscale,
					color,
					grayColor;
				if ( rgb.length ) {
					color = this.getColor(rgb);
					grayscale = ( parseInt(color.rgb[0], 16) + parseInt(color.rgb[1],16) + parseInt(color.rgb[2], 16) ) / 3;
					grayscale = Math.round(grayscale).toString(16);
					grayColor = '#'+grayscale+grayscale+grayscale;
					return grayColor;				
				}
			},
			
			/**
			 * Takes color value and return array of three color number
			 * @returns {Array} three color values for each channel [red, green, blue]
			 */
			getColor: function (rgb) {
				var rgbArr = [],
					rleng = rgb.length,
					retType = '', 
					i;
				
				if ( rgb.indexOf('rgb') > -1 ) {
					rgb = rgb.substring(4,17);
					rgbArr = rgb.split(', ');
					for (i=0; i<rgbArr.length;i++) {
						rgbArr[i] = parseInt(rgbArr[i],10).toString(16);
					}
					retType = '#';
				} else if ( rleng === 7 ) {
					rgb = rgb.slice(1,7);
					for (i=0, indx=0; i<rgb.length ; i = i+2 ) {
						rgbArr[indx] = parseInt( rgb.substring(i, i+2), 16);
						indx++;
					}
					retType = '#';
					preparedColor = '#'+rgbArr[0]+rgbArr[1]+rgbArr[2];
				} else if (rleng === 4 ) {
					rgb = rgb.slice(1,4);
					for (i=0; i<rgb.length; i++) {
						rgbArr[i] = parseInt( rgb.charAt(i)+rgb.charAt(i), 16);
					}
					retType = '#';
				}
				return {
					rgb: rgbArr,
					type: retType
				};
			},

			
			
			/**
			 * Process color images to b/w using canvas
			 * @param {Element} img image element
			 */
			processImages: function (img) {
				var canvas = document.createElement('canvas'),
					ctx = canvas.getContext('2d'),
					imgWidth = img.width,
					imgHeight = img.height,
					imageData,
					data,
					pix,
					avg;
				canvas.width = imgWidth;
				canvas.height = imgHeight;
				ctx.drawImage(img, 0, 0);
				imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
				data = imageData.data;
				for ( var y = 0; y < imageData.height; y++){
					 for ( var x = 0; x < imageData.width; x++) {
						  pix = (y * 4) * imageData.width + x * 4;
						  //adapted for human algorithm (green dominant);
						  avg = (imageData.data[pix]*0.21 + imageData.data[pix + 1]*0.71 + imageData.data[pix + 2]*0.07);
						  imageData.data[pix] = avg;
						  imageData.data[pix + 1] = avg;
						  imageData.data[pix + 2] = avg;
					 }
				}
				ctx.putImageData(imageData,0,0,0,0, imageData.width, imageData.height);
				return canvas.toDataURL();
			}
		};
		BW.init();
	};
})(jQuery);
