$ = jQuery;

function animateCSS(element, animationName, callback) {
	var node = document.querySelector(element);
	node.classList.add('animated', animationName);

	function handleAnimationEnd() {
		node.classList.remove('animated', animationName);
		node.removeEventListener('animationend', handleAnimationEnd);

		if (typeof callback === 'function') callback();
	}

	node.addEventListener('animationend', handleAnimationEnd);
}

function isValidEmailAddress(emailAddress) {
	var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
	return pattern.test(emailAddress);
};

function isValidPartyZip(partyZip) {
	var zipPattern = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
	return zipPattern.test(partyZip);
};

$('#bookedDate').datepicker({
	language: 'en',
	inline: true,
	minDate: new Date(),
	maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
	keyboardNav: false,
	onSelect: function (formattedDate, date, inst) {
		$("#nextStep").click();
	}
})
$('#calendarDiv').datepicker({
	language: 'en',
	inline: true, // This will display the calendar inline within the div
	minDate: new Date(),
	maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
	keyboardNav: false,
	onSelect: function (formattedDate, date, inst) {
		// When a date is selected, update the hidden input field
		$('#bookedDate').val(formattedDate);

		// Trigger the next step (if you need to move to the next step)
		$("#nextStep").click();
	}
});
$('.arrivalTime').change(function () {
	$("#nextStep").click();
});

function select2CopyClasses(data, container) {
	if (data.element) {
		$(container).attr('data-search', $(data.element).attr("data-search")); // Add character tags attribute to select2 choices
		$(container).attr('data-image-src', $(data.element).attr("data-image-src")); // Add image link attribute to select2 choices
	}
	return data.text;
}

function matchCustom(params, data) {
	// Case sensitive fix
	var checkText = (data.text || '').toUpperCase()
	var checkTerm = (params.term || '').toUpperCase()
	var dataElement = $(data.element).data('search').toString().toUpperCase()

	// If there are no search terms, return all of the data
	if ($.trim(checkTerm) === '') {
		return data;
	}

	// Do not display the item if there is no 'text' property
	if (typeof checkText === 'undefined') {
		return null;
	}

	// Check if the data occurs
	if (dataElement.indexOf(checkTerm) > -1) {
		return data;
	}

	// Return `null` if the term should not be displayed
	return null;
}
var characterListParent = $(".characterList").parent();
$('.characterList').select2({
	placeholder: 'Search Characters',
	width: '100%',
	closeOnSelect: false,
	scrollAfterSelect: true,
	templateResult: select2CopyClasses,
	templateSelection: select2CopyClasses,
	matcher: matchCustom,
	dropdownParent: characterListParent
});

// Character Image Preview START
$(document).on({
	mouseenter: function () {
		$('html.no-touch body').append('<div class="character-preview"><img src="' + $(this).attr('data-image-src') + '" /></div>');
	},
	mousemove: function (e) {
		$('.character-preview').css({
			left: e.pageX + 50,
			top: e.pageY - 85
		});
	},
	mouseleave: function () {
		$('.character-preview').remove();
	}
}, '.bookingCharacters .select2-results__option');
// Character Image Preview END

var locationParent = $("#bookedLocation").parent();
$('#bookedLocation').select2({
	placeholder: 'Select a Location',
	width: '100%',
	dropdownParent: locationParent
});

$(document).ready(function () {
	$(".importantField label").html('Email - Do not fill this field');
	$(".importantField input").attr('tabindex', '-1');
	$(".importantField").css({ 'position': 'absolute', 'top': '-99999px', 'left': '-99999px' });
	$(".importantField").hide();

	$("#nextStep").click(function () {
		$(this).addClass('stepDisabled');

		if ($('.bookingStep.bookingCalendar.activeStep').length != 0 && $('.bookingStep.bookingCalendar.activeStep input').val() === '') {
			$('.bookingError').html("Please select an event date.").fadeIn();
			setTimeout(function () {
				$('.bookingError').fadeOut("slow");
			}, 5000);

			$(this).removeClass('stepDisabled');
			return false;
		}

		if ($('.bookingStep.bookingTimes.activeStep').length != 0 && !$('.bookingStep.bookingTimes.activeStep input:checked').val()) {
			$('.bookingError').html("Please select an arrival time for your event.").fadeIn();
			setTimeout(function () {
				$('.bookingError').fadeOut("slow");
			}, 5000);

			$(this).removeClass('stepDisabled');
			return false;
		}

		if ($('.bookingStep.bookingCharacters.activeStep').length != 0 && $('.bookingStep.bookingCharacters.activeStep input').val() === '' && $('#bookedCharacters').val() == null) {
			$('.bookingError').html("Please select at least one character.").fadeIn();
			setTimeout(function () {
				$('.bookingError').fadeOut("slow");
			}, 5000);

			$(this).removeClass('stepDisabled');
			return false;
		}
		if ($('.bookingStep.bookingCharacters.activeStep').length !== 0) {
			const characterInput = $('.bookingStep.bookingCharacters.activeStep input').val();
			const selectedCharacters = $('#bookedCharacters').val();

			if (characterInput === '' && (selectedCharacters === null || selectedCharacters.length === 0)) {
				$('.bookingError').html("Please select at least one character.").fadeIn();
				setTimeout(function () {
					$('.bookingError').fadeOut("slow");
				}, 5000);

				$(this).removeClass('stepDisabled');
				return false;
			}
		}
		animateCSS('.bookingStep.activeStep', 'fadeOutUp', function () {
			$(".bookingStep.activeStep").nextAll('.bookingStep').first().addClass('activeStep').prevAll('.bookingStep').first().removeClass('activeStep');
			animateCSS('.bookingStep.activeStep', 'fadeInUp');
			$("#nextStep").removeClass('stepDisabled');
		});

		$('.bookingError').hide();

		if ($(".bookingStep.activeStep").nextAll('.bookingStep').first().nextAll('.bookingStep').first().length != 0) {
			$('#nextStep').show();
			$('#prevStep').show();
		} else {
			$('#nextStep').hide();
			$('#prevStep').show();
			$('#submitForm').show();
		}
		return false;
	});

	$("#prevStep").click(function () {
		$(this).addClass('stepDisabled');

		animateCSS('.bookingStep.activeStep', 'fadeOutUp', function () {
			$(".bookingStep.activeStep").prevAll('.bookingStep').first().addClass('activeStep').nextAll('.bookingStep').first().removeClass('activeStep');
			animateCSS('.bookingStep.activeStep', 'fadeInUp');
			$("#prevStep").removeClass('stepDisabled');
		});

		if ($(".bookingStep.activeStep").prevAll('.bookingStep').first().prevAll('.bookingStep').first().length != 0) {
			$('#prevStep').show();
			$('#nextStep').show();
			$('#submitForm').hide();
		} else {
			$('#prevStep').hide();
			$('#nextStep').show();
			$('#submitForm').hide();
		}
		return false;
	});

	$('#submitForm').click(function () {
		$("#bookingSubmit").click();
	});

	$('.extraCharactersButton').click(function () {
		$(".extraCharactersWrapper").show();
		$(this).hide();
	});

	$('#bookingSubmit').on("click", function () {
		var firstName = $('#firstName');
		var lastName = $('#lastName');
		var emailAddress = $('#emailAddress');
		var phoneNumber = $('#phoneNumber');
		var partyAddress = $('#partyAddress');
		var partyZip = $('#partyZip');
		var bookedLocation = $('#bookedLocation');
		var bookedLocationSelect2 = $('#bookedLocation + .select2 .select2-selection--single');
		// var username = $('#username'); // Used as Captcha to trick bots
		var pppDo = $('#pppDo'); // Used as Captcha to trick bots

		// Check if reCaptcha exists (may not be loaded on all pages)
		var reCaptcha = (typeof grecaptcha !== 'undefined') ? grecaptcha.getResponse() : 'skip';

		var invalidForm = false;
		var invalidEmail = false;
		var invalidZip = false;
		var invalidCaptcha = false;
		$('#submitForm').removeClass('stepDisabled');
		$('#submitForm').text('Request Booking');
		if ($.trim(firstName.val()) == '') {
			firstName.css('border-color', 'red');
			invalidForm = true;
		}

		if ($.trim(lastName.val()) == '') {
			lastName.css('border-color', 'red');
			invalidForm = true;
		}

		if ($.trim(emailAddress.val()) == '') {
			emailAddress.css('border-color', 'red');
			invalidForm = true;
		}

		if ($.trim(emailAddress.val()) != '' && !isValidEmailAddress(emailAddress.val())) {
			emailAddress.css('border-color', 'red');
			invalidEmail = true;
		}

		if ($.trim(phoneNumber.val()) == '') {
			phoneNumber.css('border-color', 'red');
			invalidForm = true;
		}

		if ($.trim(partyAddress.val()) == '') {
			partyAddress.css('border-color', 'red');
			invalidForm = true;
		}

		if ($.trim(partyZip.val()) == '') {
			partyZip.css('border-color', 'red');
			invalidForm = true;
		}

		if ($.trim(partyZip.val()) != '' && !isValidPartyZip(partyZip.val())) {
			partyZip.css('border-color', 'red');
			invalidZip = true;
		}

		//disable validation for booking location by GS
		/**if(bookedLocation.length != 0 && bookedLocation.val() == '') {
			bookedLocationSelect2.css('border-color', 'red');
			invalidForm = true;
		}*/

		// if($.trim(username.val()) != ''){	
		// 	invalidCaptcha = true;	
		// }

		if ($.trim(pppDo.val()) != '') {
			invalidForm = true;
		}

		// Only validate reCaptcha if it's actually loaded (not 'skip')
		if (reCaptcha !== 'skip' && reCaptcha.length == 0) {
			invalidCaptcha = true;
		}

		setTimeout(function () {
			$('input').removeAttr('style');
			$('select').removeAttr('style');
			$('textarea').removeAttr('style');
			bookedLocationSelect2.removeAttr('style');
			$('.bookingError').fadeOut("slow");
		}, 5000);

		if (invalidForm) {
			$('.bookingError').html("Please fill the highlighted fields.").fadeIn();
			return false;
		} else if (invalidEmail) {
			$('.bookingError').html("Please enter a valid Email Address.").fadeIn();
			return false;
		} else if (invalidZip) {
			$('.bookingError').html("Please enter a valid Zip Code.").fadeIn();
			return false;
		} else if (invalidCaptcha) {
			$('.bookingError').html("Please click on Captcha.").fadeIn();
			return false;
		} else {
			// Validation passed - trigger form submit event for CRM integration to handle
			// Don't return true (which would cause native POST to non-existent backend)
			$('#submitForm').text('Processing...');
			$('#submitForm').addClass('stepDisabled');

			// Dispatch submit event for CRM integration to intercept
			var form = document.getElementById('bookingForm');
			if (form) {
				form.dispatchEvent(new Event('submit', { cancelable: true }));
			}
			return false;
		}
	});

	$('.pppBookNowModal').on("click", function (e) {
		event.preventDefault();
		$('.pppBookModal').css("display", "flex")
		$('.pppBookModal').hide()
		$('.pppBookModal').fadeIn();
		fbq('trackCustom', 'Book Now');
	});

	$('.pppModalClose').on("click", function () {
		$(this).parent().parent().fadeOut();
	});

	setTimeout(function () {
		$('.characterPopUpCTA').removeClass('hideP');
		animateCSS('.characterPopUpCTA', 'fadeInUp');
	}, 2500);

	$(".characterPopUpClose").click(function () {
		$('.characterPopUpCTA').fadeOut();
	});
});

$(document).keyup(function (e) {
	if (e.key === "Escape") {
		$('.pppModalClose').click();
	}
});