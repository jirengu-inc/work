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
		var h = $('.work').width() * 3 / 4,
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
		var me = this;
		$('.works-ct').on('click', '.next', function() {
			me.pageIdx++;
			$('body').animate({
				scrollTop: $('.work').eq(me.pageIdx * me.rowNum * me.colNum + 1).offset().top
			});
		});
		$('.works-ct').on('click', '.pre', function() {
			me.pageIdx--;
			if (me.pageIdx > -1) {
				$('body').animate({
					scrollTop: $('.work').eq(me.pageIdx * me.rowNum * me.colNum + 1).offset().top
				});
			}
		});
		$('.works-ct').on('mouseenter', '.work', function() {
			if ($(this).hasClass('next') || $(this).hasClass('pre') || $(this).hasClass('empty')) return;
			var $cover = $(this).find('.cover'),
				$hover = $(this).find('.hover');
			$cover.addClass('slideOutUp');
			$hover.addClass('slideInUp');
		});
		$('.works-ct').on('mouseleave', '.work', function() {
			var $cover = $(this).find('.cover'),
				$hover = $(this).find('.hover');
			$cover.removeClass('slideOutUp');
			$hover.removeClass('slideInUp');
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
	}
};
//http://7xnk1s.com2.z0.glb.qiniucdn.com/work-1.png
var data = [{
		imgUrl: 'imgs/1.png',
		type: 'a',
		coverColor: '#b2c8d3',
		coverWord: 'a',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/2.png',
		type: 'b',
		coverColor: '#c95031',
		coverWord: 'b',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/3.png',
		type: 'c',
		coverColor: '#00b3ad',
		coverWord: 'c',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/4.png',
		type: 'd',
		coverColor: '#b2c8d3',
		coverWord: 'd',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/5.png',
		type: 'e',
		coverColor: '#ff897b',
		coverWord: 'e',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/6.png',
		type: 'f',
		coverColor: '#154142',
		coverWord: 'f',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/7.png',
		type: 'g',
		coverColor: '#959a9e',
		coverWord: 'g',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/8.png',
		type: 'h',
		coverColor: '#6d8746',
		coverWord: 'h',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/9.png',
		type: 'i',
		coverColor: '#887942',
		coverWord: 'i',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/10.png',
		type: 'j',
		coverColor: '#fdc76d',
		coverWord: 'j',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/11.png',
		type: 'l',
		coverColor: '#65141b',
		coverWord: 'k',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/12.png',
		type: 'k',
		coverColor: '#112c3f',
		coverWord: 'l',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/13.png',
		type: 'm',
		coverColor: '#c95031',
		coverWord: 'm',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/14.png',
		type: 'n',
		coverColor: '#8db1b1',
		coverWord: 'n',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/15.png',
		type: 'o',
		coverColor: '#00b3ad',
		coverWord: 'o',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/16.png',
		type: 'p',
		coverColor: '#c6d09e',
		coverWord: 'p',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/17.png',
		type: 'q',
		coverColor: '#00b3ad',
		coverWord: 'q',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/18.png',
		type: 'r',
		coverColor: '#c95031',
		coverWord: '若',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/19.png',
		type: 's',
		coverColor: '#6b3922',
		coverWord: '若',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/20.png',
		type: 't',
		coverColor: '#221e1f',
		coverWord: '若',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/21.png',
		type: 'u',
		coverColor: '#f38eae',
		coverWord: '若',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/22.png',
		type: 'v',
		coverColor: '#ab422f',
		coverWord: '5',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	}, {
		imgUrl: 'imgs/22.png',
		type: 'w',
		coverColor: '#221e1f',
		coverWord: '若',
		username: '若愚',
		userLink: 'http://hunger.coding.io',
		description: '京东页面',
		voteLink: 'http://www.baidu.com',
		workLink: 'http://jirengu.com'
	},
	// {
	//            imgUrl: 'imgs/22.png',
	//            type: 'x',
	//            coverColor: '#ecb1c5',
	//            coverWord: '若',
	//            username: '若愚',
	//            userLink: 'http://hunger.coding.io',
	//            description: '京东页面',
	//            voteLink: 'http://www.baidu.com',
	//            workLink: 'http://jirengu.com'
	//        },    {
	//            imgUrl: 'imgs/22.png',
	//            type: 'y',
	//            coverColor: '#b2c8d3',
	//            coverWord: '若',
	//            username: '若愚',
	//            userLink: 'http://hunger.coding.io',
	//            description: '京东页面',
	//            voteLink: 'http://www.baidu.com',
	//            workLink: 'http://jirengu.com'
	//        },    {
	//            imgUrl: 'imgs/22.png',
	//            type: 'z',
	//            coverColor: '#8495af',
	//            coverWord: '若',
	//            username: '若愚',
	//            userLink: 'http://hunger.coding.io',
	//            description: '京东页面',
	//            voteLink: 'http://www.baidu.com',
	//            workLink: 'http://jirengu.com'
	//        },    {
	//            imgUrl: 'imgs/16.png',
	//            type: 'p',
	//            coverColor: '#c6d09e',
	//            coverWord: '若',
	//            username: '若愚',
	//            userLink: 'http://hunger.coding.io',
	//            description: '京东页面',
	//            voteLink: 'http://www.baidu.com',
	//            workLink: 'http://jirengu.com'
	//        },    {
	//            imgUrl: 'imgs/17.png',
	//            type: 'q',
	//            coverColor: '#00b3ad',
	//            coverWord: '若',
	//            username: '若愚',
	//            userLink: 'http://hunger.coding.io',
	//            description: '京东页面',
	//            voteLink: 'http://www.baidu.com',
	//            workLink: 'http://jirengu.com'
	//        },    {
	//            imgUrl: 'imgs/18.png',
	//            type: 'r',
	//            coverColor: '#c95031',
	//            coverWord: '若',
	//            username: '若愚',
	//            userLink: 'http://hunger.coding.io',
	//            description: '京东页面',
	//            voteLink: 'http://www.baidu.com',
	//            workLink: 'http://jirengu.com'
	//        },    {
	//            imgUrl: 'imgs/19.png',
	//            type: 's',
	//            coverColor: '#6b3922',
	//            coverWord: '若',
	//            username: '若愚',
	//            userLink: 'http://hunger.coding.io',
	//            description: '京东页面',
	//            voteLink: 'http://www.baidu.com',
	//            workLink: 'http://jirengu.com'
	//        },    {
	//            imgUrl: 'imgs/20.png',
	//            type: 't',
	//            coverColor: '#221e1f',
	//            coverWord: '若',
	//            username: '若愚',
	//            userLink: 'http://hunger.coding.io',
	//            description: '京东页面',
	//            voteLink: 'http://www.baidu.com',
	//            workLink: 'http://jirengu.com'
	//        },    {
	//            imgUrl: 'imgs/21.png',
	//            type: 'u',
	//            coverColor: '#f38eae',
	//            coverWord: '若',
	//            username: '若愚',
	//            userLink: 'http://hunger.coding.io',
	//            description: '京东页面',
	//            voteLink: 'http://www.baidu.com',
	//            workLink: 'http://jirengu.com'
	//        },    {
	//            imgUrl: 'imgs/22.png',
	//            type: 'v',
	//            coverColor: '#ab422f',
	//            coverWord: '若',
	//            username: '若愚',
	//            userLink: 'http://hunger.coding.io',
	//            description: '京东页面',
	//            voteLink: 'http://www.baidu.com',
	//            workLink: 'http://jirengu.com'
	//        },    {
	//            imgUrl: 'imgs/22.png',
	//            type: 'w',
	//            coverColor: '#221e1f',
	//            coverWord: '若',
	//            username: '若愚',
	//            userLink: 'http://hunger.coding.io',
	//            description: '京东页面',
	//            voteLink: 'http://www.baidu.com',
	//            workLink: 'http://jirengu.com'
	//        },    {
	//            imgUrl: 'imgs/22.png',
	//            type: 'x',
	//            coverColor: '#ecb1c5',
	//            coverWord: '若',
	//            username: '若愚',
	//            userLink: 'http://hunger.coding.io',
	//            description: '京东页面',
	//            voteLink: 'http://www.baidu.com',
	//            workLink: 'http://jirengu.com'
	//        }
];