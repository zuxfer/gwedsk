/*! Normalized address bar hiding for iOS & Android (c) @scottjehl MIT License */
(function( win ){
	var doc = win.document;
	
	// If there's a hash, or addEventListener is undefined, stop here
	if( !location.hash && win.addEventListener ){
		
		//scroll to 1
		win.scrollTo( 0, 1 );
		var scrollTop = 1,
			getScrollTop = function(){
				return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
			},
		
			//reset to 0 on bodyready, if needed
			bodycheck = setInterval(function(){
				if( doc.body ){
					clearInterval( bodycheck );
					scrollTop = getScrollTop();
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}	
			}, 15 );
		
		win.addEventListener( "load", function(){
			setTimeout(function(){
				//at load, if user hasn't scrolled more than 20 or so...
				if( getScrollTop() < 20 ){
					//reset to hide addr bar at onload
					win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
				}
			}, 0);
		}, false );
	}
})( this );
YUI.add('le-main', function (Y) {

    var nav = Y.one('.nav');

    nav.one('.nav-toggle').on('click', function (e) {
        e.preventDefault();
        nav.one('.nav-toggle').toggleClass('is-nav-item-active');
        nav.one('.nav-items').toggleClass('is-nav-items-active');
    });

}, '1.8.0', {
    requires: ['node-base']
});

YUI.add('le-maps', function (Y) {

    var isRetina = Y.config.win.devicePixelRatio >= 2;

    Y.all('[data-map]').each(function (mapNode) {
        mapbox.load(mapNode.getData('map'), function (data) {
            var map = mapbox.map(mapNode.getDOMNode(), [
                data.layer,
                data.markers
            ], null, [
                MM.DoubleClickHandler(),
                MM.DragHandler()
            ]);

            if (isRetina) {
                map.tileSize = {x: 128, y: 128};
            }

            map.ui.zoomer.add();
            map.centerzoom(data.center, data.zoom);
        });
    });

}, '1.8.0', {
    requires: ['node-base', 'mapbox']
});

YUI.add('le-wedding', function (Y) {

    var cal = Y.one('.cal'),
        graphic;

    function centerCal() {
        var scrollWidth = cal.get('scrollWidth'),
            clientWidth = cal.get('clientWidth');

        if (scrollWidth > clientWidth) {
            cal.set('scrollLeft', (scrollWidth - clientWidth) / 2);
        }
    }

    graphic = new Y.Graphic({
        id    : 'cal-day-circle',
        render: cal.one('.cal-day-primary')
    });

    graphic.addShape({
        type  : 'ellipse',
        width : 140,
        height: 28,

        stroke: {
            weight: 2,
            color : '#f2c63d'
        }
    });

    Y.one(graphic.get('node')).setStyles({
        left  : null,
        width : '100%',
        height: 'auto'
    }).get('parentNode').setStyle({
        width: '100%'
    });

    Y.one('#cal-day-circle').setStyles({
        left: null,
        top : 0
    });

    centerCal();
    Y.one('win').on(['orientationchange', 'windowresize'], centerCal);

}, '1.8.0', {
    requires: ['le-main', 'le-maps', 'event-resize', 'graphics']
});
