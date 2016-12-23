    ;(function _swiper(el){
        var defaults = {
            el:el,
            items:el.find('.li-swiper-item'),
            container:$(el.find('.li-swiper-slides')),
            current:parseInt(el.attr('current')),
            dots:$(el.find('.li-swiper-dots')),
            interval:el.attr('interval') || 5000,
            duration:parseInt(el.attr('duration')) || 1000,
            autoplay:el.attr('autoplay'),
            'indicator-dots':el.attr('indicator-dots')
        };
        this.defaults = defaults;
    })
    _swiper.prototype = {
        init:function () {
            var that = this;
            var isMobile = li.isMobile();
            that.defaults.items.each(function () {
                $(this).css({
                    position:'absolute',
                    left:'0px'
                });
                that._setOffset();
                that._setTransform();
            });
            that._setTransition(that.defaults.duration);
            if(that.defaults.autoplay == 'autoplay') { //自动切换
                that._autoplay();
            }
            if(isMobile){
                // that.defaults.container.on('click',function(e){e.preventDefault();return false;});
                that.defaults.container.off('touchstart').on('touchstart',function(e){ that._handleDown(e)});
                that.defaults.container.off('touchmove').on('touchmove',function(e){ that._handleMove(e)});
                that.defaults.container.off('touchend').on('touchend',function(e){ that._handleEnd(e)});
            }else{
                that.defaults.container.off('mousedown').on('mousedown',function(e){ that._handleDown(e)});
            }

        },
        _autoplay:function () {
            var that = this;
            var interval = that.defaults.interval,
                current = that.defaults.current;
            var count = this.defaults.items.length;
            var time = setInterval(function(){
                current += 1;
                current = current%count;
                that._moveIndex(current);
                that._setOffset();
                that._setTransform();
            },interval);
            this.timer = time;
        },
        _setTransition:function(duration){
            var that = this;
            that.defaults.items.each(function(){
                var transition = duration  === 'none' ? 'none': duration + 'ms';
                $(this).css('webkitTransition', transition);
                $(this).css('transition', transition);
            })
        },
        _setTransform:function (offset) {
            var that = this;
            offset = parseFloat(offset) || 0;   //touchmove的时候用
            that.defaults.items.each(function (key,$item) {
                var distance = that.offset[key]+offset;
                var transform = 'translate3d('+distance+'px,0,0)';
                $($item).css('webkitTransform', transform);
                $($item).css('transform', transform);
            });
        },
        _setOffset:function () {
            var that = this;
            var count = that.defaults.current;
            var length = $(that.defaults.items[0]).width();
            that.offset = [];
            that.defaults.items.each(function(key,$item){
                that.offset.push((key-count)*length);
            });
        },
        _stop:function () {
            this.timer && clearInterval(this.timer);
        },
        _moveIndex:function(index){  //改变index
            this.defaults.current = index;
            $(this.defaults.dots.find('.wx-swiper-dot')[index]).addClass('wx-swiper-dot-active').siblings().removeClass('wx-swiper-dot-active');
        },
        _handleDown:function (e) {
            e.preventDefault();
            var that = this;
            this._stop();
            this._setTransition('none');
            this._startX = e.pageX || e.originalEvent.targetTouches&&e.originalEvent.targetTouches[0].pageX;
            this._startY = e.pageY || e.originalEvent.targetTouches&&e.originalEvent.targetTouches[0].pageY;

            var isMobile = _g.device.mobile();
            if(!isMobile){
                that.defaults.container.on('mousemove',function(e){ that._handleMove(e)});
                that.defaults.container.on('mouseout',function(e){ that._handleOut(e)});
                that.defaults.container.on('mouseup',function(e){ that._handleEnd(e)});
            }
            return false;
        },
        _handleMove:function (e) {
            e.preventDefault();
            this._x = e.pageX || e.originalEvent.targetTouches&& e.originalEvent.targetTouches[0].pageX;
            this._y = e.pageY || e.originalEvent.targetTouches&&e.originalEvent.targetTouches[0].pageY;
            var durationX = this._x - this._startX;
            this._setTransform(durationX);
            return false;
        },
        _handleOut:function(e){
            e.preventDefault();
            this._handleEnd(e);
            return false;
        },
        _handleEnd:function (e) {
            e.preventDefault();
            var that = this;
            var _endX = e.pageX || e.originalEvent.changedTouches&&e.originalEvent.changedTouches[0].pageX,
                _endY = e.pageY || e.originalEvent.changedTouches&&e.originalEvent.changedTouches[0].pageY;
            var _length = $(this.defaults.items[0]).width();
            var dir = _endX - this._startX;

            var index = this.defaults.current;
            var count = this.defaults.items.length;

            this._setTransition(this.defaults.duration);
            if(Math.abs(dir)>_length/3){  //大于一半
                if(index == 0 && dir>0 || index == count-1 && dir<0)  this.go(index);
                else if(dir<0) this.go(index+1);
                else if(dir>0) this.go(index-1);
            }else{  //小于一半
                this._setTransform();
            }
            if(this.defaults.autoplay == 'autoplay') { //自动切换
                // setTimeout(function(){
                that._autoplay()
                // },that.defaults.interval);
            }
            var isMobile = _g.device.mobile();
            if(!isMobile){
                that.defaults.container.off('mousemove mouseup mouseout');
            }
            return false;
        },
        go:function (index) {
            var count = this.defaults.items.length;
            index = index % count;
            this._moveIndex(index);
            this._setOffset();
            this._setTransform();
        }
    }
}