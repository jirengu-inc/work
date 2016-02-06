/**
 * Created by wingo on 16/2/3.
 */

var Resize = {
    init: function(){
        this.bind();
        this.resize();
    },

    bind: function(){
        var me = this;
        $(window).on('resize', function(){
           me.resize();
        });
    },

    resize: function(){
        var $work  = $('.work');
        $work.height($work.width()*3/4);

    }
};

