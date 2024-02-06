import { reviewsData } from './data.js';
$(document).ready(function () {
  initTeamSection();
  initSkillsSection();
  initAchievementSection();
  initReviewsSection();
  setMobileMenu();

  addLoadContentEventHandlers();

  function addLoadContentEventHandlers() {
    const reviewsSection = document.querySelector('.reviews-slider');
    $(window).on('scroll', function () {
      if (isElementInViewport(reviewsSection)) {
        setupReviewsSlider();
        $(window).off('scroll');
      }
    });
  }
  function setMobileMenu() {
    $('.mobile-menu-open').on('click', function () {
      $('.mobile-menu-container').animate(
        {
          right: 0,
        },
        300,
      );
      $('body').addClass('no-scroll');
    });
    $('.mobile-menu-close').on('click', function () {
      $('.mobile-menu-container').animate(
        {
          right: '-100vw',
        },
        300,
      );
      $('body').removeClass('no-scroll');
    });
  }
  function initTeamSection() {
    $('#owl-carousel1').owlCarousel({
      loop: true,

      navText: [
        `
                <svg class="hexagon-shape" >
                  <use href="./images/sprite.svg#icon-hexagon"></use>
                </svg>
                <i class="fa-solid fa-chevron-left slider-team-btn"></i>
              
        
        `,
        `
                <svg class="hexagon-shape" >
                  <use href="./images/sprite.svg#icon-hexagon"></use>
                </svg>
                <i class="fa-solid fa-chevron-right slider-team-btn"></i>
              
        
        `,
      ],
      nav: true,
      responsive: {
        375: {
          items: 1,
          margin: 40,
        },
        768: {
          items: 3,
          margin: 50,
        },
        1200: {
          items: 3,
          margin: 150,
        },
      },
    });
  }

  function initSkillsSection() {
    const elms = document.querySelectorAll('.skill-per');

    elms.forEach(el => {
      new Waypoint({
        element: el,
        handler: function () {
          const per = el.getAttribute('per');
          el.style.width = per + '%';
          animateSkill(el, per);
          this.destroy();
        },
        offset: 'bottom-in-view',
      });
    });
    function animateSkill(element, percentage) {
      let animatedValue = 0;
      const duration = 1000;
      const stepDuration = 10;
      const stepValue = (percentage / duration) * stepDuration;

      const animationInterval = setInterval(() => {
        animatedValue += stepValue;
        if (animatedValue >= percentage) {
          animatedValue = percentage;
          clearInterval(animationInterval);
        }
        element.setAttribute('per', Math.floor(animatedValue) + '%');
      }, stepDuration);
    }
  }

  function initReviewsSection() {
    generateReviewsMarkup(reviewsData);

    const el = document.querySelector('.reviews-slider');
    if (isElementInViewport(el)) {
      setupReviewsSlider();
    }
  }

  function generateReviewsMarkup(data) {
    const $reviewsSlider = $('.reviews-slider');
    $.each(data, function (_, review) {
      const $reviewItem = generateReviewItem(review);
      $reviewsSlider.append($reviewItem);
    });

    function generateReviewItem(review) {
      const $reviewItem = $('<li>').addClass('reviews__item');
      const $reviewsWrap = $('<div>').addClass('reviews__img-wrap');
      const $reviewsPhoto = $('<img>')
        .addClass('reviews__photo')
        .attr({
          src: `images/${review.img}`,
          alt: 'Photo of client',
        });
      $reviewsWrap.append($reviewsPhoto);
      const $reviewsDescr = $('<p>')
        .addClass('reviews__descr')
        .text(review.text);
      const $reviewsName = $('<p>')
        .addClass('reviews__name')
        .text(review.author);

      $reviewItem.append($reviewsWrap, $reviewsDescr, $reviewsName);
      return $reviewItem;
    }
  }

  function setupReviewsSlider() {
    let currentSlide = 0;
    let autoplayInterval;

    initialize();

    function initialize() {
      addControls();
      attachEventHandlers();
      toggleActiveThumbClass(currentSlide);
      startAutoplay();
    }

    function addControls() {
      const thumbnailsSlider = createThumbnailsSlider();
      $('.reviews__container').append(thumbnailsSlider);
    }

    function attachEventHandlers() {
      $('.thumbnail').on('click', handleThumbnailClick);
      $('.reviews-slider').hover(
        function () {
          stopAutoplay();
        },
        function () {
          startAutoplay();
        },
      );
    }

    function handleThumbnailClick() {
      const index = $(this).index();
      goToSlide(index);
    }
    function createThumbnailsSlider() {
      const thumbnailsSlider = $('<div>').addClass(
        'thumbnails thumbnails-slider',
      );
      for (let i = 0; i < reviewsData.length; i++) {
        $('<div>').addClass('thumbnail').appendTo(thumbnailsSlider);
      }

      return thumbnailsSlider;
    }

    function showSlide(index) {
      const slider = $('.reviews-slider ');
      const slideWidth = $('.reviews__item').width();

      if (index < 0) {
        index = slider.children().length - 1;
      } else if (index >= slider.children().length) {
        index = 0;
      }

      currentSlide = index;

      const transformValue = -index * slideWidth;
      slider.css('transform', `translateX(${transformValue}px)`);
    }

    function goToSlide(index) {
      showSlide(index);
      toggleActiveThumbClass(index);
    }

    function toggleActiveThumbClass(index) {
      const thumbList = $('.thumbnail');
      thumbList.addClass('shaded', 4000, 'easeOutBounce');
      thumbList.eq(index).removeClass('shaded');
    }
    function startAutoplay() {
      autoplayInterval = setInterval(() => {
        currentSlide =
          (currentSlide + 1) % $('.reviews-slider').children().length;
        showSlide(currentSlide);
        toggleActiveThumbClass(currentSlide);
      }, 2000);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }
  }

  function initAchievementSection() {
    const counterUp = window.counterUp.default;
    const elements = document.querySelectorAll('.achievement-value');
    elements.forEach(el => {
      new Waypoint({
        element: el,
        handler: function () {
          counterUp(el);
          this.destroy();
        },
        offset: 'bottom-in-view',
      });
    });
  }

  function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
});
