/**
 * Created by wingo on 16/2/3.
 */

var Resize = {
	init: function(listsData) {
		this.set(listsData);
		this.insertWorks();
		this.dealRowCols();
		this.insertBNPage();
		this.insertEmpty();
		this.setHeight();
		this.setImg();
		this.bind();
	},
	set: function(listsData) {
		/**
		 *  [{
		 *      imgUrl: '1.png',
		 *      coverColor: '#ff00ff',
		 *      coverWord: '若',
		 *      username: '若愚',
		 *      userLink: 'http://hunger.coding.io',
		 *      description: '京东页面',
		 *      viewcount: 11,
		 *      votecount: 12,
		 *      voteLink: 'http://www.baidu.com',
		 *      workLink: 'http://jirengu.com'
		 *  }]
		 */
		this.listsData = listsData;
		this.workTpl = $('#work-template').html();
		this.nextTpl = $('#next-template').html();
		this.preTpl = $('#pre-template').html();
		this.emptyTpl = $('#empty-template').html();
		this.pageIdx = 0;
		this.workHeight = 0;
		this.workWidth = 0;
		this.rowNum = 0;
		this.colNum = 0;
	},
	empty: function() {
		$('.work-lists').empty();
	},
	insertWorks: function() {
		var listsData = this.listsData,
			len = listsData.length;
		for (var i = 0; i < len; i++) {
			var html = Mustache.render(this.workTpl, listsData[i]),
				$work = $(html);
			$('.work-lists').append($work);
		}
	},
	dealRowCols: function() {
		var h = $('.work').width() * 7 / 8,
			rows = parseInt($(window).height() / h),
			mod = $(window).height() % h;
		if (mod > (h / 2)) {
			rows++;
		}
		this.workHeight = $(window).height() / rows;
		this.workWidth = $('.work').width();
		this.colNum = Math.round($(window).width() / this.workWidth);
		this.rowNum = rows;
	},
	setHeight: function() {
		$('.work').height(this.workHeight);
		setTimeout(function() {
			$(document.body).scrollTop(0);
		}, 10);
	},
	bind: function() {
		var me = this,
			evtType;
		if(this.isPhone()){
			evtType = 'touchstart';
			$('.work-normal .cover').addClass('bounceOutUp');
			$('.work-normal .hover').addClass('bounceInUp');
		}else{
			evtType = 'click';
		}
		$('.works-ct').on(evtType, '.next', function() {
			me.pageIdx++;
			$('body').animate({
				scrollTop: $('.work').eq(me.pageIdx * me.rowNum * me.colNum + 1).offset().top
			});
		});
		$('.works-ct').on(evtType, '.pre', function() {
			me.pageIdx--;
			if (me.pageIdx > -1) {
				$('body').animate({
					scrollTop: $('.work').eq(me.pageIdx * me.rowNum * me.colNum + 1).offset().top
				});
			}
		});
		
		$('.works-ct').on('mouseenter', '.work-normal', function() {
			if ($(this).find('.user').text() === '') return;
			var $cover = $(this).find('.cover'),
				$hover = $(this).find('.hover');
			$cover.addClass('bounceOutUp'); //bounceInUp bounceOutUp slideOutUp slideInUp
			$hover.addClass('bounceInUp');
		});
		$('.works-ct').on('mouseleave', '.work', function() {
			var $cover = $(this).find('.cover'),
				$hover = $(this).find('.hover');
			$cover.removeClass('bounceOutUp');
			$hover.removeClass('bounceInUp');
		});
		$(window).on('resize', function() {
			if (me.clock) {
				clearTimeout(me.clock);
				me.clock = setTimeout(function() {
					me.resize();
				}, 500);
			} else {
				me.clock = setTimeout(function() {
					me.resize();
				}, 500);
			}
		});
	},
	insertBNPage: function() {
		//  40
		// 6*4, 2*6*4  3*6*4...    6*4+6  2*6*4+6
		for (var i = 1; this.colNum * this.rowNum * i < $('.work').length; i++) {
			var $next = $(this.nextTpl);
			var $pre = $(this.preTpl);
			$next.insertBefore($('.work').eq(this.colNum * this.rowNum * i - 1));
			if (this.colNum * this.rowNum * i + this.colNum - 2 < $('.work').length) {
				$pre.insertAfter($('.work').eq(this.colNum * this.rowNum * i + this.colNum - 2));
			} else if (this.colNum * this.rowNum * i + this.colNum - 2 >= $('.work').length) {
				for (var j = 0; j < this.colNum * this.rowNum * i + this.colNum - 1 - $('.work').length; j++) {
					var $empty = $(this.emptyTpl);
					$('.work-lists').append($empty);
					$empty.height(this.workHeight);
				}
				$pre.insertAfter($('.work').eq(this.colNum * this.rowNum * i + this.colNum - 2));
			}
			$next.height(this.workHeight);
			$pre.height(this.workHeight);
		}
	},
	insertEmpty: function() {
		var mod = $('.work').length % (this.rowNum * this.colNum),
			last = (mod === 0) ? 0 : (this.rowNum * this.colNum - mod);
		for (var i = 0; i < last; i++) {
			var $empty = $(this.emptyTpl);
			$('.work-lists').append($empty);
			$empty.height(this.workHeight);
		}
	},
	setImg: function() {
		var me = this;
		$('.work .img-ct img').on('load', function() {
			$(this).css('margin-top', (me.workHeight - me.workWidth) / 2);
		});
	},
	resize: function() {
		this.pageIdx = 0;
		this.workHeight = 0;
		this.workWidth = 0;
		this.rowNum = 0;
		this.colNum = 0;
		this.empty();
		this.insertWorks();
		this.dealRowCols();
		this.insertBNPage();
		this.insertEmpty();
		this.setImg();
		this.setHeight();
	},
	isPhone: function(){
		return !!navigator.userAgent.match(/iphone|android|ipad/i) || $(window).width()<768;
	}
};
