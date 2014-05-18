var Slider = function(options) {

    var track;
    var handle;
    var handleBorder;
    var maxWidth;
    
    //	Store pre-calculated percentages and sizes for track. 
    //	@see	#precalcScale
    //
    var pcSizes;
    
    var container = options.container || document.body;

	//	A "normalized" #getBoundingClientRect, ensuring the existence
	//	of a #width and #height property
	//
	var boundingRect = function(el) {
		var br = el.getBoundingClientRect();
		if(!br.width) {
			br.width 	= br.right - br.left;
			br.height 	= br.bottom - br.top;
		}
		return br;
	}
	
	//	Note that the handle is "pushed" by a resizing track
	//
	var precalcScale = function() {
		var i = 0;
		
		pcSizes = [];
		
		for(; i <= maxWidth; i++) {
			pcSizes[i] = {
				w : i - handleBorder + "px",
				p : Math.ceil(100 * i / maxWidth)
			}
		}
	}

	var resizeTrack = function(size) {
		var s = pcSizes[Math.floor(size)];
		track.style.width = s.w;
		options.onChange && options.onChange(s.p);
	}

	//	Event handlers. Note that we add, then remove, relevant event listeners
	//	when handle is grabbed, released.
	//
    var grabHandle = function(ev) {
    	ev.stopPropagation();
        document.addEventListener('mousemove', moveHandle, false);
        document.addEventListener('mouseup', dropHandle, false);
    };

    var dropHandle = function() {
        document.removeEventListener('mousemove', moveHandle, false);
        document.removeEventListener('mouseup', dropHandle, false);
    };
    
   	var moveHandle = function(ev) {
       	var x = parseInt(ev.clientX) - boundingRect(track).left;
		if(x >= 0 && x <= maxWidth) {
        	resizeTrack(x);
		}
    };
    
	//	
	//	Expose API
	//
	
	//	Set position to some percentage of track width.
	//	
	//	@param {Decimal}	p	Between 0 and 1
	//
	this.setPercentage = function(p) {
		if(Math.floor(p) === 0) {
			resizeTrack(maxWidth * p);
		}
	};
    
    //
    //	INIT
    //
    //	Insert the track into a container, insert the handle into the
    //	track, calculate necessary values. Note how the handle is "pushed"
    //	by a resizing track. See CSS.
    //
	track 			= document.createElement('div');
	track.className = 'slider-track';
	container.appendChild(track);
	
	handle 				= document.createElement('div');
	handle.className 	= 'slider-handle';
	track.appendChild(handle);

	//	Down on handle, set up for manual movement.
	//	Down on anywhere else in container, move handle to that position.
	//
	handle.addEventListener('mousedown', grabHandle, false);
	container.addEventListener('mousedown', function(ev) {
		moveHandle(ev, true);
	}, false);
	
	maxWidth = boundingRect(container).width;
	
	//	Need to adjust for border when grabbing.
	//	@see precalcScale
	//
	handleBorder = parseInt(getComputedStyle(handle,null).getPropertyValue('border-left-width'));
	
	precalcScale();

	if(options.initPerct) {
		this.setPercentage(options.initPerct);
	}
};