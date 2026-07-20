/**
 * A plugin to enable placeholder tokens to be inserted into the CKEditor message. Use on its own or with teh placeholder plugin.
 * The default format is compatible with the placeholders syntex
 *
 * @version 0.1
 * @Author Troy Lutton
 * @license MIT
 *
 * This is a pure modification for the placeholders plugin. All credit goes to Stuart Sillitoe for creating the original (stuartsillitoe.co.uk)
 *
 */

CKEDITOR.plugins.add('placeholder_button', {
	init: function (editor) {
		// add the menu to the editor

		editor.addCommand('placeholder_button', {
			exec: function (editor) {
				const openkeywordmodal = editor.getCommand('openkeywordmodal');
				openkeywordmodal.handleOpen();
			},
		});

		editor.ui.addButton('placeholder_button', {
			label: 'Từ khóa',
			command: 'placeholder_button',
			className: 'placeholder_button',
			toolbar: 'placeholder',
		});
	},
});
