!function(Foundation, $) {
  'use strict';

  /**
   * Creates a new instance of DropdownMenu.
   * @class
   * @fires DropdownMenu#init
   * @param {jQuery} element - jQuery object to make into a dropdown menu.
   * @param {Object} options - Overrides to the default plugin settings.
   */
  function DropdownMenu(element) {
    this.$element = element;
    this.options = $.extend({}, DropdownMenu.defaults, this.$element.data());

    // this.$openMenu = $();
    this._init();

    /**
     * Fires when the plugin has been successfuly initialized.
     * @event DropdownMenu#init
     */
    this.$element.trigger('init.zf.dropdown');
  }

  /**
   * Default settings for plugin
   */
  DropdownMenu.defaults = {
    // toggleOn: 'both',
    clickOpen: true,
    closeOnClick: true,
    disableHover: false,
    autoclose: true,
    hoverDelay: 150,
    closingTime: 500,
    keyboardAccess: true,
    wrapOnKeys: true,
    alignment: 'left',
    vertical: false
  };

  DropdownMenu.prototype._init = function() {
    this.$element.attr('role', 'menubar');
    this.options.vertical = this.$element.hasClass('vertical');
    this._prepareMenu(this.$element);
    // this._addTopLevelKeyHandler();
  };

  DropdownMenu.prototype._prepareMenu = function(){
    var _this = this;
    this.$tabs = this.$element.children('li.has-submenu');
    this.$tabs.children('[data-submenu]').addClass('first-sub');
    this.$submenus = this.$element.find('li.has-submenu');
    this.$menuItems = this.$element.find('li').attr({'role': 'menuitem', 'tabindex': 0});
    this.$menuItems.children('a').attr('tabindex', -1);
    if(this.$element.hasClass('align-right')){
      this.options.alignment = 'right';
      this.$submenus.addClass('right');
    }

    this.$tabs.each(function(){
      var $tab = $(this);
      $tab.attr({
        'role': 'menuitem',
        'tabindex': 0,
        'title': $tab.children('a:first-child').text()/*.match(/\w/ig).join('')*/
      }).children('a').attr('tabindex', -1);//maybe add a more specific regex to match alphanumeric characters and join them appropriately
      if($tab.children('[data-submenu]')){
        $tab.attr('aria-haspopup', true);
      }
    });
    // this.$tabs[0].setAttribute('tabindex', 0);

    this.$submenus.each(function(){
      var $sub = $(this);

      if(_this.$element.hasClass('align-right')){
        $sub.children('[data-submenu]').addClass('right');
      }

      $sub.children('[data-submenu]')
          .attr({
            'aria-hidden': true,
            'tabindex': -1,
            'role': 'menu'
          }).addClass('vertical');
      _this._events($sub);
    });
    this._keys();
  };
  DropdownMenu.prototype._handleKeys = function(e, elem){
    var usedKeys = [9, 13, 27, 32, 37, 38, 39, 40],
        key = e.which;

    e.stopImmediatePropagation();

    if(usedKeys.indexOf(key) < 0){ return; }
    if(key !== 9){
      if((key === 13 || key === 32) && !$(elem).hasClass('has-submenu')){ return; }//if it's a normal link, don't prevent default on return, just move on.

      e.preventDefault();
      // console.log('prevented', key);

      if(key === 27){ this._hideAll(); }

      else if(key === 13 || key === 32){ this._show($(elem)); }

      else{//direction keys... the gnarly bit.
        var $elem = $(elem),
            isTop = this.$tabs.index($elem) > -1,
            isVert = isTop ? this.options.vertical : $elem.parent('[data-submenu]').hasClass('vertical'),
            isRight = this.options.alignment === 'right',
            $siblings = $elem.siblings('[role="menuitem"]'),
            first = $siblings.eq(0),
            last = $siblings.eq(-1),
            next = $elem.next().length ? $elem.next() : first,
            prev = $elem.prev().length ? $elem.prev() : last,
            // child = $elem.hasClass('has-submenu') ? $elem.find('[role="menuitem"]:first-of-type') : undefined;
            child, parent;
        console.log(isVert, elem);
        if(key === 37){
          if(isVert){
            if(isRight){

            }else{
              if(isTop){ return; }
              parent = $elem.parentsUntil('.has-submenu').parent('[role="menuitem"]').focus();
              console.log(parent);
              this._hide(parent);
            }
          }else{
              child = prev.find('[role="menuitem"]:first-of-type');
              if(child.length){
                this._show(prev);
              }else{
                this._hideOthers(prev);
              }
              prev.focus();
            }
        }
        else if(key === 38){
          console.log('up');
        }
        else if(key === 39){
          if(isVert){
            if(isRight){

            }else{

            }
          }else{
            if(isRight){

            }else{
              child = next.find('[role="menuitem"]:first-of-type');
              if(child.length){
                this._show(next);
              }else{
                this._hideOthers(next);
              }
              next.focus();
            }
          }
          console.log('right');
        }
        else{
          console.log('down');
        }//40/down
      }
    }

  };
  DropdownMenu.prototype._keys = function(){
    var _this = this;
    this.$menuItems.off('keydown.zf.dropdownmenu').on('keydown.zf.dropdownmenu', function(e){
      _this._handleKeys(e, this);
    })
  }
  DropdownMenu.prototype._events = function($elem){
    var _this = this;
        // fns = {
        //   show: '_show',
        //   hide: '_hide',
        //   hideAll: '_hideAll',
        //   toggle: '_toggle'
        // },
        // isVert, isRight, first, last, next, prev, child;

    // if(this.options.keyboardAccess){
    //   this._addKeyupHandler($elem);
    // }
    // this.$menuItems.off('keydown.zf.dropdownmenu').on('keydown.zf.dropdownmenu', function(e){
    //   _this._handleKeys(e, this);
      // console.log('this', $(this));
      // var $elm = $(this)
      // var $parent = $elm.parent('li.has-submenu');
      // $parent = $parent.length ? $parent : _this.$element;
      // isVert = $elm.hasClass('vertical') || $elm.parent('[data-submenu]').hasClass('vertical');
      // isRight = $elm.hasClass('right');
      // first = $parent.children('li:first-of-type');
      // last = $parent.children('li:last-of-type');
      // next = $elm.next().length ? $elm.next() : first;
      // prev = $elm.prev().length ? $elm.prev() : last;
      // child = $elm.children('[data-submenu]').length ? $elm.children('[data-submenu]').find('li').eq(0) : null
      // console.log(isVert);
      // Foundation.MenuKey(e, $elm, _this, isVert, isRight, first, last, next, prev, $parent, child, fns);
      // console.log('elem', $elm, 'first', first, 'last', last, 'right', isRight, 'vert', isVert);
    // });

    if(this.options.clickOpen){
      $elem.on('click.zf.dropdownmenu tap.zf.dropdownmenu touchend.zf.dropdownmenu', function(e){
        e.preventDefault();
        e.stopPropagation();

        if($elem.data('isClick')){
          _this._hide($elem);
        }else{
          _this._hideOthers($elem);
          _this._show($elem);
          $elem.data('isClick', true).parentsUntil('[data-dropdown-menu]', '.has-submenu').data('isClick', true);
          if(_this.options.closeOnClick){
            _this._addBodyHandler();
          }
        }
      });
    }

    if(!this.options.disableHover){
      //add ability for all menu items to close an open menu on the same level//
      this.$menuItems.on('mouseenter.zf.dropdownmenu', function(e){
        var $el = $(this);
        if(!$el.hasClass('is-active')){
          _this._hideOthers($el);
        }
      });
      //elements with submenus
      $elem.on('mouseenter.zf.dropdownmenu', function(e){
        clearTimeout($elem.closeTimer);
        if(!$elem.hasClass('is-active')){
          $elem.openTimer = setTimeout(function(){
              // _this._hideOthers($elem);
              _this._show($elem);
          }, _this.options.hoverDelay);
        }
      }).on('mouseleave.zf.dropdownmenu', function(e){
        if(!$elem.data('isClick') && _this.options.autoclose){
        clearTimeout($elem.openTimer);
          $elem.closeTimer = setTimeout(function(){
            _this._hide($elem);
          }, _this.options.closingTime);
        }
      });
    }
  };

  DropdownMenu.prototype._toggle = function($elem){
    var _this = this;
    // console.log($elem);
    if($elem.hasClass('is-active')){
      _this._hide($elem);
    }else{
      // console.log('this',this);
      this._show($elem);
    }
  };
  DropdownMenu.prototype._addBodyHandler = function(){
    var $body = $('body'),
        _this = this;
    $body.not(_this.$element).on('click.zf.dropdownmenu tap.zf.dropdownmenu touchend.zf.dropdownmenu', function(e){
      _this._hideAll();
      $body.off('click.zf.dropdownmenu tap.zf.dropdownmenu touchend.zf.dropdownmenu');
    })
  };
//show & hide stuff @private
  DropdownMenu.prototype._show = function($elem){
    this._hideOthers($elem);
    $elem.focus();
    // console.log('showing some stuff', $elem.find('li:first-child'));
    var $sub = $elem.children('[data-submenu]:first-of-type');
    $elem.addClass('is-active');
    $sub.css('visibility', 'hidden').addClass('js-dropdown-active')
        .attr('aria-hidden', false);


    //break this into own function
    var clear = Foundation.ImNotTouchingYou($sub, null, true);
    if(!clear){
      if(this.options.alignment === 'left'){
        $sub.addClass('right');
      }else{
        $sub.removeClass('right');
      }
      this.changed = true;
    }
      $sub.css('visibility', '');
  };

  DropdownMenu.prototype._hide = function($elem){
    this._hideSome($elem);
  };
  DropdownMenu.prototype._hideSome = function($elems){
    if($elems.length){
      // if($elems.hasClass('first-sub')){
      //   console.log('true');
      //   $elems.blur();
      // }
      $elems.removeClass('is-active').data('isClick', false)

            .find('.is-active').removeClass('is-active').data('isClick', false).end()

            .find('.js-dropdown-active').removeClass('js-dropdown-active')
                                        .attr('aria-hidden', true);
      $elems.parent('.has-submenu').removeClass('is-active');
      if(this.changed){
        //remove position class
        if(this.options.alignment === 'left'){
          $elems.find('.right').removeClass('right');
        }else{
          $elems.find('[data-submenu]').addClass('right');
        }
      }
    }
  };
  DropdownMenu.prototype._hideOthers = function($elem){
    this._hideSome($elem.siblings('.has-submenu.is-active'));
  };
  DropdownMenu.prototype._hideAll = function(){
    this._hideSome(this.$element);
  };
//****
  DropdownMenu.prototype.destroy = function() {
    this._hideAll();
    this.$element
        .removeData('zf-plugin')
        .find('li')
        .removeClass('js-dropdown-nohover')
        .off('.zf.dropdownmenu');
  };
  Foundation.plugin(DropdownMenu);

  function checkClass($elem){
    return $elem.hasClass('is-active');
  }

}(Foundation, jQuery);



// DropdownMenu.prototype._addTopLevelKeyHandler = function(){
//   // Foundation.KeyboardAccess(this);
//   // var _this = this,
//   //     vertical = this.options.vertical,
//   //     $firstItem = this.$element.children('li:first-of-type'),
//   //     $lastItem = this.$element.children('li:last-of-type');
//   // this.$tabs.on('focus.zf.dropdownmenu', function(){
//   //   // console.log('what?', this);
//   //   _this._show($(this));
//   // }).on('focusout.zf.dropdownmenu', function(e){
//   //   console.log('au revoir');
//   //   _this._hide($(this))
//   // });
//   // this.$tabs.on('keydown.zf.dropdownmenu', function(e){
//   //   if (e.which !== 9) {
//   //     e.preventDefault();
//   //     e.stopPropagation();
//   //   }
//   //   console.log(e.which);
//   //
//   //   var $tabTitle = $(this),
//   //       $prev = $tabTitle.prev(),
//   //       $next = $tabTitle.next();
//   //   if(_this.options.wrapOnKeys){
//   //     $prev = $prev.length ? $prev : $lastItem;
//   //     $next = $next.length ? $next : $firstItem;
//   //   }
//   //   if(checkClass($prev) || checkClass($next)){
//   //     return;
//   //   }
//   //
//   //   switch (e.which) {
//   //
//   //     case 32://return or spacebar
//   //     case 13:
//   //       console.log($tabTitle.find('ul.submenu > li:first-of-type'));
//   //       $tabTitle.find('[role="menuitem"]:first-of-type').addClass('is-active').focus().select();
//   //       // _this._hideOthers($tabTitle);
//   //       _this._show($tabTitle);
//   //       break;
//   //
//   //     case 40: //down
//   //       break;
//   //     case 38://up
//   //       break;
//   //
//   //     case 37://left
//   //     if(vertical){
//   //       break;
//   //     }
//   //       $prev.focus();
//   //       // _this._hideOthers($prev);
//   //       _this._show($prev);
//   //       break;
//   //     case 39://right
//   //     if(vertical){
//   //       break;
//   //     }
//   //       $next.focus();
//   //       // _this._hideOthers($next);
//   //       _this._show($next);
//   //       break;
//   //
//   //     case 27://esc
//   //       _this._hideAll();
//   //       $tabTitle.blur();
//   //       break;
//   //     default:
//   //       return;
//   //   }
//   // });
// };
//
// DropdownMenu.prototype._addKeyupHandler = function($elem){
//
//
// };
