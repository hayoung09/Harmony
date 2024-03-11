$(() => {
	const loginBtn = $('#loginButton');

	loginBtn.on('click', () => {
		const text = loginBtn.text().toUpperCase();

		if (text === 'LOG IN') {
			const loginTemplate = $('#loginForm');
			const template = document.createElement('template');
			const main = $('body');

			template.innerHTML = loginTemplate.html();

			const loginForm = template.content.children[0];
			loginForm.style.opacity = '0';
			loginForm.style.transition = 'opacity 400ms';

			setTimeout(() => {
				loginForm.style.opacity = '1';

				if (loginSubmit.querySelector('#userid')) {
					loginSubmit.querySelector('#userid').focus();
				}
			}, 10);

			loginForm.addEventListener('click', (event) => {
				if (event.target === loginForm) {
					loginForm.style.opacity = '0';

					setTimeout(() => {
						$(loginForm).remove();
					}, 400);
				}
			});

			const loginSubmit = loginForm.querySelector('form');
			loginSubmit.addEventListener('submit', (event) => {
				event.preventDefault();

				const userId = loginSubmit.querySelector('#userid');
				const userPassword = loginSubmit.querySelector('#userpw');

				if (userId.value === 'admin' && userPassword.value === 'admin') {
					$(loginForm).remove();
          sessionStorage.setItem('user', userId.value);
					loginBtn.text('LOGOUT');
				} else {
					alert('ID 또는 Password 가 올바르지 않습니다.');
				}
			});

			main.append(loginForm);
		} else {
      sessionStorage.removeItem('user');
			loginBtn.text('LOG IN');
		}
	});

  if ((sessionStorage.getItem('user') || '') !== '') {
    loginBtn.text('LOGOUT');
  }
});

$(() => {
	const slidesPictureList = $('.slide-picture-list');
	slidesPictureList.each(function() {
		const slidePictureList = $(this);
		const slidePictureDetail = slidePictureList.next('.slide-picture-detail');
		const slidePictureDetailImage = slidePictureDetail.find('picture img');

		const pictureList = slidePictureList.find('.slide .slide-content picture');

		let activePictureIndex = null;

		const getPictureIndex = (picture) => {
			for (let i = 0; i < pictureList.length; i++) {
				if (pictureList.get(i) === picture) {
					return i;
				}
			}
			return -1;
		};

		const handleClickPicture = (picture) => {
			const pictureIndex = getPictureIndex(picture);

			if (slidePictureDetail.hasClass('displaying') && pictureIndex === activePictureIndex) {
				slidePictureDetail.removeClass('displaying');
				slidePictureDetailImage.removeAttr('src');
			} else {
				const pictureImageSource = picture.querySelector('img').getAttribute('src');
				slidePictureDetailImage.attr('src', pictureImageSource);
				slidePictureDetail.addClass('displaying');
				activePictureIndex = pictureIndex;
			}
		};

		pictureList.on('click', function() {
			console.log(this);
			handleClickPicture(this);
		});

		slidePictureList.data('handleClickPicture', handleClickPicture);
	});
	const slides = $('.slide');
	slides.each(function() {
		const slide = $(this);
		const slidePictureList = slide.parents('.slide-picture-list');
		const slidePictureListHandler = slidePictureList.data('handleClickPicture');

		const content = slide.find('.slide-content > div');
		const items = content.find('> *');

		// ADD CONTROL
		const control = $(`<div class="slide-control"></div>`);
		control.append($(`<button class="slide-btn btn-prev"></button>`));
		control.append($(`<button class="slide-btn btn-next"></button>`));
		
		slide.append(control);

		// ADD INDICATOR
		const indicator = $(`<div class="slide-indicator"></div>`);
		items.each(function() {
			indicator.append($('<button></button>'));
		});
		
		slide.append(indicator);

		// DEFINE

		const indicators = slide.find('.slide-indicator button');
		const prevBtn = slide.find('.slide-control .btn-prev');
		const nextBtn = slide.find('.slide-control .btn-next');

		const state = {
			currentIndex: 0,
			idle: true,
			duration: 400,
		};

		const handleSlide = (index) => {
			if (!state.idle || state.currentIndex === index || index < 0 || index > indicators.length - 1) {
				return;
			}

			state.idle = false;

			indicators.removeClass('active');
			indicators.eq(index).addClass('active');

			content.css({'transition': `transform ${state.duration}ms`, 'transform': `translateX(${-index * 100}%)`});
			setTimeout(() => {
				state.idle = true;
			}, state.duration);

			if (typeof slidePictureListHandler === 'function') {
				slidePictureListHandler(content.find('picture').get(index));
			}

			state.currentIndex = index;

			handleSlideControl();
		};

		const handleSlidePrev = () => {
			handleSlide(state.currentIndex - 1);
		};

		const handleSlideNext = () => {
			handleSlide(state.currentIndex + 1);
		};

		const handleSlideControl = () => {
			if (state.currentIndex > 0) {
				prevBtn.removeAttr('disabled');
			} else {
				prevBtn.attr('disabled', true);
			}

			if (state.currentIndex < indicators.length - 1) {
				nextBtn.removeAttr('disabled');
			} else {
				nextBtn.attr('disabled', true);
			}
		};

		slide.data('getCurrentIndex', () => {
			return state.currentIndex;
		});

		slide.data('handleSlide', handleSlide);

		prevBtn.on('click', handleSlidePrev);
		nextBtn.on('click', handleSlideNext);
		indicators.on('click', function() {
			handleSlide($(this).index());
		});

		indicators.first().addClass('active');
		handleSlideControl();
	});

	$(document.documentElement).on('keydown', (event) => {
		if (event.keyCode === 37 || event.keyCode === 39) {
			const scrollTop = $(window).scrollTop();
			const windowHeight = $(window).height();

			slides.filter(function() {
				const slide = $(this);
				const slideOffset = slide.offset();
				const slideHeight = slide.height();

				const condition1 = scrollTop < slideOffset.top;
				const condition2 = scrollTop + windowHeight > slideOffset.top + slideHeight;
				const condition3 = windowHeight < slideHeight && (scrollTop > slideOffset.top || scrollTop + windowHeight < slideOffset.top + slideHeight);

				return (condition1 & condition2) | condition3;
			}).each(function() {
				const slide = $(this);
				
				if (event.keyCode === 37) {
					slide.find('.slide-control .btn-prev').click();
				}
				if (event.keyCode === 39) {
					slide.find('.slide-control .btn-next').click();
				}
			});
		}
	});
});

$(() => {
	const videos = $('.video-player');

	videos.each(function() {
		const player = $(this);
		const container = player.find('.video-player-container');
		const video = player.find('video');

		// ADD CONTROL
		const control = $(`<div class="video-player-control"></div>`);
		control.append($(`<button class="video-btn"></button>`));
		
		container.append(control);

		// DEFINE

		const videoBtn = player.find('.video-btn');

		const handleVideoPlay = () => {
			video[0].play();
			player.addClass('playing');
		};

		const handleVideoPause = () => {
			video[0].pause();
			player.removeClass('playing');
		};

		const handleVideo = () => {
			if (player.hasClass('playing')) {
				handleVideoPause();
			} else {
				handleVideoPlay();
			}
		};

		video.on('ended', handleVideoPause);
		videoBtn.on('click', handleVideo);
	});
});

$(() => {
	const idSketch = $('#id-sketch');
	const pictureList = idSketch.find('.picture-list');
	const slide = pictureList.find('.slide');

	const getCurrentIndex = slide.data('getCurrentIndex');
	const handleSlide = slide.data('handleSlide');

	if (typeof getCurrentIndex !== 'function'
		  || typeof handleSlide !== 'function') {
		return;
	}

	pictureList.on('click', '> div > picture', function() {
		const picture = $(this);
		const pictureIndex = picture.index();
		const currentIndex = getCurrentIndex();

		if (pictureIndex === currentIndex) {
			if (!pictureList.hasClass('displaying')) {
				handleSlide(pictureIndex);
			}
			pictureList.toggleClass('displaying');
		} else {
			if (!pictureList.hasClass('displaying')) {
				pictureList.addClass('displaying');
			}
			handleSlide(pictureIndex);
		}
	});
});
