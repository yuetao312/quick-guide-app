import './index.scss';

// 存储上一个租赁页面的ID
let previousRentalPage: string | null = null;
let pageHistory: string[] = ['page-home'];

/**
 * 显示指定页面
 * @param pageId 要显示的页面ID
 */
function showPage(pageId: string): void {
  const $currentPage = $('.page.active');
  const $nextPage = $(`#${pageId}`);

  if ($nextPage.length === 0 || $currentPage.attr('id') === pageId) {
    return;
  }

  if (pageId !== pageHistory[pageHistory.length - 1]) {
    pageHistory.push(pageId);
  }

  $currentPage.removeClass('active');
  $nextPage.addClass('active');
}

/**
 * 返回到上一个页面
 */
function goBack(): void {
  if (pageHistory.length > 1) {
    pageHistory.pop();
    const previousPageId = pageHistory[pageHistory.length - 1];
    showPage(previousPageId);
  }
}

function closeMobileSidebar() {
  $('.sidebar').removeClass('open');
  $('.overlay').removeClass('active');
  $('.guide-container').removeClass('sidebar-open');
}

// 页面加载完成后绑定所有事件
$(document).ready(function () {
  showPage('page-home'); // Initial page load

  // 首页按钮
  $('.btn-rental').on('click', function () {
    const target = $(this).data('target');
    if (target) {
      showPage(target);
    } else if ($(this).text().includes('租赁设备')) {
      showPage('page-rental');
    } else if ($(this).text().includes('1个月（含）以内')) {
      showPage('page-approval-within');
    } else if ($(this).text().includes('1个月以上')) {
      showPage('page-approval-over');
    }
  });

  $('.btn-purchase').on('click', function () {
    const target = $(this).data('target');
    if (target) {
      showPage(target);
    } else if ($(this).text().includes('采购业务')) {
      showPage('page-purchase');
    } else if ($(this).text().includes('设备采购')) {
      showPage('page-purchase-equipment');
    } else if ($(this).text().includes('物资采购')) {
      showPage('page-purchase-material');
    } else if ($(this).text().includes('单机＜30万元')) {
      showPage('page-equipment-company');
    } else if ($(this).text().includes('单机≥30万元')) {
      showPage('page-equipment-seven');
    } else if ($(this).text().includes('单项＜30万元')) {
      showPage('page-material-project');
    } else if ($(this).text().includes('单项≥30万元')) {
      showPage('page-material-company-above');
    }
  });

  $('.btn-disposal').on('click', function () {
    const target = $(this).data('target');
    const buttonText = $(this).text();

    if (target) {
      showPage(target);
    } else if (buttonText.includes('废旧物资处置')) {
      showPage('page-disposal');
    } else if (buttonText.includes('设备报废')) {
      showPage('page-equipment-disposal');
    } else if (buttonText.includes('物资报废')) {
      showPage('page-material-disposal');
    } else if (buttonText.includes('报废设备原值 ＜ 100万元')) {
      showPage('page-equipment-disposal-under100');
    } else if (buttonText.includes('报废设备原值 ≥ 100万元')) {
      showPage('page-equipment-disposal-over100');
    } else if (buttonText.includes('拟处置价值 ＜ 200万元')) {
      showPage('page-material-disposal-under200');
    } else if (buttonText.includes('拟处置价值 ≥ 200万元')) {
      showPage('page-material-disposal-over200');
    }
  });

  $('.btn-transport').on('click', function () {
    const target = $(this).data('target');
    if (target) {
      showPage(target);
    } else if ($(this).text().includes('运输业务')) {
      showPage('page-transport');
    } else if ($(this).text().includes('继续办理')) {
      showPage('page-complete');
    }
  });

  $('.btn-warning').on('click', function () {
    showPage('page-material-notice');
  });

  $('.btn-guide').on('click', function () {
    showPage('page-emp-guide');
  });

  $('.btn-info').on('click', function () {
    const currentPageId = pageHistory[pageHistory.length - 1];
    if (currentPageId === 'page-material-project') {
      showPage('page-material-regulation');
    } else if (currentPageId === 'page-approval-within') {
      showPage('page-rental-regulation-within');
    } else if (currentPageId === 'page-approval-over') {
      showPage('page-rental-regulation-over');
    } else if (currentPageId === 'page-equipment-disposal-under100') {
      showPage('page-equipment-disposal-notice');
    } else if (currentPageId === 'page-material-disposal-under200') {
      showPage('page-material-disposal-notice');
    }
  });

  $('.btn-emp').on('click', function () {
    showPage('page-emp-process');
  });

  $('.btn-back').on('click', function () {
    goBack();
  });

  $('.btn-complete, .btn-primary').on('click', function () {
    pageHistory = [];
    showPage('page-home');
  });

  // EMP Guide page scroll functionality
  $('#page-emp-guide .sidebar a').on('click', function (e) {
    e.preventDefault();
    const targetId = $(this).attr('href');
    if (targetId) {
      const $target = $(targetId);
      const position = $target.position();
      const mainContent = $('.main-content');
      if (position && mainContent) {
        mainContent.animate(
          {
            scrollTop: position.top + mainContent.scrollTop()! - 20,
          },
          500
        );
      }
    }
    const windowWidth = $(window).width();
    if (windowWidth && windowWidth <= 768) {
      closeMobileSidebar();
    }
  });

  // Highlight sidebar link on scroll
  $('.main-content').on('scroll', function () {
    let currentId = '';
    $('.main-content section').each(function () {
      const position = $(this).position();
      if (position && position.top <= 25) {
        currentId = `#${$(this).attr('id')}`;
      }
    });

    if (currentId) {
      $('#page-emp-guide .sidebar a').removeClass('active');
      $(`#page-emp-guide .sidebar a[href="${currentId}"]`).addClass('active');
    }
  });

  // Sidebar toggle functionality
  $('#sidebar-toggle-btn').on('click', function () {
    $('.sidebar').addClass('open');
    $('.overlay').addClass('active');
    $('.guide-container').addClass('sidebar-open');
  });

  $('.overlay').on('click', function () {
    closeMobileSidebar();
  });

  // Image Modal functionality
  const $modal = $('#image-modal');
  const $modalImg = $('#modal-image');
  const $thumbnail = $('#emp-thumbnail');
  const $closeBtn = $('.close-btn');

  $thumbnail.on('click', function () {
    $modal.css('display', 'flex');
    const src = $(this).attr('src');
    if (src) {
      $modalImg.attr('src', src);
    }
  });

  const closeModal = function () {
    $modal.css('display', 'none');
    $modalImg.removeClass('zoomed'); // Reset zoom on close
  };

  $closeBtn.on('click', closeModal);

  $modal.on('click', function (e) {
    if (e.target !== $modalImg.get(0)) {
      closeModal();
    }
  });

  $modalImg.on('click', function () {
    $(this).toggleClass('zoomed');
    if ($(this).hasClass('zoomed')) {
      $(this).css({
        'transform': 'scale(1.5)',
        'cursor': 'zoom-out'
      });
    } else {
      $(this).css({
        'transform': 'scale(1)',
        'cursor': 'zoom-in'
      });
    }
  });
});
