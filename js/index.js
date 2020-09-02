let waterfallModel = (function ($) {
  let $columns = $(".column"),
    _data = null;
  //请求数据
  let queryDate = () => {
    $.ajax({
      url: "../json/data.json",
      method: "get",
      async: false,
      success: (res) => {
        _data = res;
      },
    });
    // console.log(_data);
  };
  //   绑定数据1
  let bindHTML = () => {
    for (let i = 0; i < _data.length; i += 3) {
      $columns
        .sort((a, b) => {
          let $a = $(a),
            $b = $(b);
          return $a.outerHeight() - $b.outerHeight();
        })
        .each((index, item) => {
          let dataItem = _data[i + index];
          if (!dataItem) return;
          let { pic, height, id, title, link } = dataItem;
          $(item).append(`
              <a href="${link}" class="item">
                <div class="imgBox" style="height:${height}px">
                    <img src="" alt="" data-img="${pic}" />
                </div>
                <p>${id}.${title} </p>
              </a>
                `);
        });
    }
    setTimeout(lazyImgs, 1000);
  };

  //绑定数据2
  //   let bindHTML = () => {
  //     for (let i = 0; i < _data.length; i += 3) {
  //       let group = _data.slice(i, i + 3);
  //       i !== 0 ? group.sort((a, b) => b.height - a.height) : null;
  //       $columns
  //         .sort((a, b) => {
  //           let $a = $(a),
  //             $b = $(b);
  //           return $a.outerHeight() - $b.outerHeight();
  //         })
  //         .each((index, item) => {
  //           let dataItem = group[index];
  //           if (!dataItem) return;
  //           let { pic, height, id, title, link } = dataItem;
  //           $(item).append(`
  //           <a href="${link}" class="item">
  //             <div class="imgBox" style="height:${height}px">
  //               <img src="" alt="" data-img="${pic}" />
  //             </div>
  //             <p>${id}.${title} </p>
  //           </a>
  //                 `);
  //         });
  //     }
  //     setTimeout(lazyImgs, 1000);
  //   };
  //图片懒加载
  let lazyImgs = () => {
    let $imgBoxs = $(".container .imgBox[isLoad!='true']"),
      $window = $(window),
      scrollH = $window.outerHeight() + $window.scrollTop();
    $imgBoxs.each((index, item) => {
      let $imgBox = $(item),
        $img = $imgBox.children("img"),
        imgT = $imgBox.outerHeight() + $imgBox.offset().top;
      if (imgT <= scrollH) {
        $imgBox.attr("isLoad", "true");
        $img.attr("src", $img.attr("data-img"));
        $img.on("load", function () {
          $img.stop().fadeIn();
        });
      }
    });
  };

  //加载更多的数据
  let loadMore = () => {
    let $window = $(window),
      winH = $window.outerHeight(),
      scrollT = $window.scrollTop(),
      pageH = $(document).outerHeight();
    if (winH + scrollT + 500 >= pageH) {
      queryDate();
      bindHTML();
    }
  };

  return {
    init() {
      queryDate();
      bindHTML();
      $(window).on("scroll", function () {
        lazyImgs();
        loadMore();
      });
    },
  };
})(jQuery);

waterfallModel.init();
