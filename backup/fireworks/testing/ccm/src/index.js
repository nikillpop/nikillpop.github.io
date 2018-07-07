window.rightClickTrick = function (list) {

  var id = '_contextMenuTrick' + (new Date()).getTime()
  var $contextMenu = renderContextMenuDom(list)
  var visible = false

  renderStyles({
    ['#' + id]: {
      'display': 'none',
      'padding': '3px 0',
      'border': '1px solid #b6b6b6',
      'width': '155px',
      'background': 'linear-gradient(to bottom, rgb(238, 238, 238), rgb(238, 238, 238))',
      'color': '#1c0f00',
      'font-size': '13px',
      'border-radius': '5px',
      'cursor': 'default',
      'box-shadow': '0px 3px 15px 0px rgba(0, 0, 0, 0.22)'
    },
    ['#' + id + '> div']: {
      'padding': '2px 20px'
    },
    ['#' + id + '> div.divider']: {
      'background-color': '#d9d9d9 !important',
      'height': '2px',
      'padding': '0',
      'margin': '5px 0'
    },
    ['#' + id + '> div.disabled']: {
      'background-color': 'inherit !important',
      'color': '#B2B5BB !important'
    },
    ['#' + id + '> div:hover']: {
      'background-color': '#4190fe',
      'color': '#fff'
    }
  })

  function renderStyles (styleObj) {
    var $style = document.createElement('style')
    var styles = ''

    for (var className in styleObj) {
      var classCss = className + '{'
      for (var key in styleObj[className]) {
        classCss += ';' + key + ':' + styleObj[className][key]
      }
      classCss += '}'
      styles += classCss
    }

    $style.type = 'text/css'
    $style.innerHTML = styles

    document.head.appendChild($style)
  }

  function renderContextMenuDom (listArr) {
    var $list = document.createElement('div')
    var listFrag = document.createDocumentFragment()
    $list.id = id

    for (var i = 0; i < listArr.length; i++) {
      var $li = document.createElement('div')
      $li.textContent = listArr[i].title
      $li.dataset.index = i

      if (listArr[i].hasOwnProperty('isDivider') && listArr[i].isDivider) {
        $li.className = 'divider'
      }

      if (listArr[i].hasOwnProperty('disabled') && listArr[i].disabled) {
        $li.className = 'disabled'
      }
      listFrag.appendChild($li)
    }

    $list.appendChild(listFrag)
    return $list
  }

  function callContextMenu (x, y) {
    $contextMenu.style.cssText = 'display:none;position:fixed;top:' + y + 'px; left:' + x + 'px'
  }

  function toggleContextMenu () {
    const display = $contextMenu.style.display

    if (display === 'none') {
      $contextMenu.style.display = 'block'
      visible = true
    } else {
      $contextMenu.style.display = 'none'
      visible = false
    }
  }

  // 初始化 contextMenu
  document.body.appendChild($contextMenu)

  // 全局右键拦截
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault()
    callContextMenu(e.pageX, e.pageY)
    toggleContextMenu()
  }, false)

  // 全局左键拦截, 隐藏 contextMenu
  document.addEventListener('mousedown', function (e) {
    if (visible) {
      e.preventDefault()

      if (!e.target.dataset.index) {
        toggleContextMenu()
      }
    }
  }, false)

  // 菜单点击
  document.getElementById(id).addEventListener('click', function (e) {
    e.preventDefault()
    var className = e.target.className

    if (className === 'disabled' || className === 'divider') {
      return
    }

    var i = e.target.dataset.index
    toggleContextMenu()
    list[i].onClick()
  }, false)

}