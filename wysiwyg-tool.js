import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';

if (document) {
	var iconset = document.createElement('iron-iconset-svg');
	iconset.setAttribute('size', 24);
	iconset.setAttribute('name', 'wysiwyg-tool');

	iconset.innerHTML = `
		<svg
			<defs>
				<g id="updateInsert">
					<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
				</g>
				<g id="close">
					<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
				</g>
				<g id="remove">
					<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
				</g>
			</defs>
		</svg>
	`;

	window.addEventListener('load', () => {
		document.body.appendChild(iconset);
	});
}

export class WysiwygTool extends PolymerElement {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}

				paper-button,
				#dropdown > paper-button[slot="dropdown-trigger"] {
					padding: 0;
					margin: 0;
					height: 40px;
					line-height: 40px;
					border-radius: 0px;
					min-width: 40px;
					background: transparent;
					text-transform: none;
				}

				#dropdown {
					padding: 0;
				}

				paper-button,
				#dropdown,
				#dropdown > paper-button[slot="dropdown-trigger"] {
					color: inherit;
					background: transparent;
				}

				:host([active]) > paper-button,
				:host([active]) > #dropdown > paper-button[slot="dropdown-trigger"] {
					color: var(--wysiwyg-tool-icon-active-color, rgba(0, 0, 0, 0.5));
					background: transparent;
				}

				:host([disabled]) > paper-button,
				:host([disabled]) > #dropdown > paper-button[slot="dropdown-trigger"] {
					color: var(--wysiwyg-tool-icon-disabled-color, rgba(255, 255, 255, 0.5));
					background: transparent;
				}

				paper-icon-button#close {
					color: var(--wysiwyg-tool-button-close, rgba(0, 0, 0, 0.5));
				}

				paper-icon-button#remove {
					color: var(--wysiwyg-tool-button-remove, #d23f31);
				}

				paper-icon-button#updateInsert {
					color: var(--wysiwyg-tool-button-updateinsert, #2A9AF2);
				}

				paper-input,
				paper-dropdown-menu {
					--paper-input-container-focus-color: var(--wysiwyg-tool-focus-color, #2a9af2);
					width: 400px;
					max-width: 100%;
				}

				paper-item {
					padding: 8px 16px;
				}

				paper-item:hover {
					cursor: pointer;
				}

				paper-toggle-button {
					--paper-toggle-button-checked-bar-color: #2A9AF2;
					--paper-toggle-button-checked-button-color: #2A9AF2;
					--paper-toggle-button-unchecked-ink-color: #2A9AF2;
					--paper-toggle-button-checked-ink-color: #2A9AF2;
				}

				#dropdown > [slot="dropdown-content"] paper-menu-button {
					padding: 0;
					color: black;
				} 
			</style>
		`
	}

	static get properties() {
		return {
			//
			// A computed boolean indicating whether the selection includes a node implemented by this tool
			//
			active: {
				type: Boolean,
				value: false,
				computed: '_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath)',
				reflectToAttribute: true,
				observer: '_activeChanged'
			},
			//
			// Array of style types allowed by tool for the editor's sanitize method
			//
			allowedStyleTypes: {
				type: Array,
				value: function () {
					return [];
				}
			},
			//
			// Array of tagNames allowed by tool for the editor's sanitize method
			//
			allowedTagNames: {
				type: Array,
				value: function () {
					return [];
				}
			},
			//
			// Synced to the editor's canRedo property
			//
			canRedo: {
				type: Boolean,
				value: false,
				readOnly: true,
				observer: '_canRedoChanged'
			},
			//
			// Synced to the editor's canUndo property
			//
			canUndo: {
				type: Boolean,
				value: false,
				readOnly: true,
				observer: '_canUndoChanged'
			},
			//
			// Synced to the editor's commonAncestorPath property
			//
			commonAncestorPath: {
				type: Array,
				value: null,
				readOnly: true,
				observer: '_commonAncestorPathChanged'
			},
			//
			// Synced to the editor's debug property
			//
			debug: {
				type: Boolean,
				value: false,
				readOnly: true,
				observer: '_debugChanged',
			},
			//
			// A computed boolean indicating whether the tool can be used with the selection
			//
			disabled: {
				type: Boolean,
				value: true,
				computed: '_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath)',
				reflectToAttribute: true,
				observer: '_disabledChanged'
			},
			//
			// Synced to the editor's forceNarrow property
			//
			forceNarrow: {
				type: Boolean,
				value: true,
				readOnly: true,
				observer: '_forceNarrowChanged'
			},
			//
			// Synced to the editor's language property
			//
			language: {
				type: String,
				value: '',
				readOnly: true,
				observer: '_languageChanged'
			},
			//
			// Synced to the editor's minWidth768px property
			//
			minWidth768px: {
				type: Boolean,
				value: true,
				readOnly: true,
				observer: '_minWidth768pxChanged'
			},
			//
			// Synced to the editor's modifier property
			//
			modifier: {
				type: Object,
				value: function () {
					return {};
				},
				readOnly: true,
				observer: '_modifierChanged'
			},
			//
			// Synced to the editor's range0 property
			//
			range0: {
				type: Object,
				value: null,
				readOnly: true,
				observer: '_range0Changed'
			},
			//
			// Key-value pairs of tags that should be replaced by other tags
			//
			replacementTagNames: {
				type: Object,
				value: function () {
					return {};
				}
			},
			//
			// Synced to the editor's selectionRoot property
			//
			selectionRoot: {
				type: Object,
				value: null,
				readOnly: true,
				observer: '_selectionRootChanged'
			},
			//
			// Synced to the editor's target property
			//
			target: {
				type: Object,
				value: function () {
					return this;
				},
				readOnly: true,
				observer: '_targetChanged'
			},
			//
			// Synced to the editor's tooltipPosition property
			//
			tooltipPosition: {
				type: String,
				value: 'bottom',
				readOnly: true,
				observer: '_tooltipPositionChanged'
			},
			//
			// Synced to the editor's value property
			//
			value: {
				type: String,
				value: '',
				readOnly: true,
				observer: '_valueChanged'
			}
		};
	}

	// From http://locutus.io/php/get_html_translation_table/
	getHtmlTranslationTable(table, quoteStyle) {
		var entities = {};
		var hashMap = {};
		var decimal;
		var constMappingTable = {};
		var constMappingQuoteStyle = {};
		var useTable = {};
		var useQuoteStyle = {};
		constMappingTable[0] = 'HTML_SPECIALCHARS';
		constMappingTable[1] = 'HTML_ENTITIES';
		constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
		constMappingQuoteStyle[2] = 'ENT_COMPAT';
		constMappingQuoteStyle[3] = 'ENT_QUOTES';
		useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
		useQuoteStyle = !isNaN(quoteStyle) ? constMappingQuoteStyle[quoteStyle] : quoteStyle ? quoteStyle.toUpperCase() : 'ENT_COMPAT';
		if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') throw new Error('Table: ' + useTable + ' not supported');
		entities['38'] = '&amp;';

		if (useTable === 'HTML_ENTITIES') {
			entities['160'] = '&nbsp;';
			entities['161'] = '&iexcl;';
			entities['162'] = '&cent;';
			entities['163'] = '&pound;';
			entities['164'] = '&curren;';
			entities['165'] = '&yen;';
			entities['166'] = '&brvbar;';
			entities['167'] = '&sect;';
			entities['168'] = '&uml;';
			entities['169'] = '&copy;';
			entities['170'] = '&ordf;';
			entities['171'] = '&laquo;';
			entities['172'] = '&not;';
			entities['173'] = '&shy;';
			entities['174'] = '&reg;';
			entities['175'] = '&macr;';
			entities['176'] = '&deg;';
			entities['177'] = '&plusmn;';
			entities['178'] = '&sup2;';
			entities['179'] = '&sup3;';
			entities['180'] = '&acute;';
			entities['181'] = '&micro;';
			entities['182'] = '&para;';
			entities['183'] = '&middot;';
			entities['184'] = '&cedil;';
			entities['185'] = '&sup1;';
			entities['186'] = '&ordm;';
			entities['187'] = '&raquo;';
			entities['188'] = '&frac14;';
			entities['189'] = '&frac12;';
			entities['190'] = '&frac34;';
			entities['191'] = '&iquest;';
			entities['192'] = '&Agrave;';
			entities['193'] = '&Aacute;';
			entities['194'] = '&Acirc;';
			entities['195'] = '&Atilde;';
			entities['196'] = '&Auml;';
			entities['197'] = '&Aring;';
			entities['198'] = '&AElig;';
			entities['199'] = '&Ccedil;';
			entities['200'] = '&Egrave;';
			entities['201'] = '&Eacute;';
			entities['202'] = '&Ecirc;';
			entities['203'] = '&Euml;';
			entities['204'] = '&Igrave;';
			entities['205'] = '&Iacute;';
			entities['206'] = '&Icirc;';
			entities['207'] = '&Iuml;';
			entities['208'] = '&ETH;';
			entities['209'] = '&Ntilde;';
			entities['210'] = '&Ograve;';
			entities['211'] = '&Oacute;';
			entities['212'] = '&Ocirc;';
			entities['213'] = '&Otilde;';
			entities['214'] = '&Ouml;';
			entities['215'] = '&times;';
			entities['216'] = '&Oslash;';
			entities['217'] = '&Ugrave;';
			entities['218'] = '&Uacute;';
			entities['219'] = '&Ucirc;';
			entities['220'] = '&Uuml;';
			entities['221'] = '&Yacute;';
			entities['222'] = '&THORN;';
			entities['223'] = '&szlig;';
			entities['224'] = '&agrave;';
			entities['225'] = '&aacute;';
			entities['226'] = '&acirc;';
			entities['227'] = '&atilde;';
			entities['228'] = '&auml;';
			entities['229'] = '&aring;';
			entities['230'] = '&aelig;';
			entities['231'] = '&ccedil;';
			entities['232'] = '&egrave;';
			entities['233'] = '&eacute;';
			entities['234'] = '&ecirc;';
			entities['235'] = '&euml;';
			entities['236'] = '&igrave;';
			entities['237'] = '&iacute;';
			entities['238'] = '&icirc;';
			entities['239'] = '&iuml;';
			entities['240'] = '&eth;';
			entities['241'] = '&ntilde;';
			entities['242'] = '&ograve;';
			entities['243'] = '&oacute;';
			entities['244'] = '&ocirc;';
			entities['245'] = '&otilde;';
			entities['246'] = '&ouml;';
			entities['247'] = '&divide;';
			entities['248'] = '&oslash;';
			entities['249'] = '&ugrave;';
			entities['250'] = '&uacute;';
			entities['251'] = '&ucirc;';
			entities['252'] = '&uuml;';
			entities['253'] = '&yacute;';
			entities['254'] = '&thorn;';
			entities['255'] = '&yuml;';
		}
		
		if (useQuoteStyle !== 'ENT_NOQUOTES') entities['34'] = '&quot;'
		if (useQuoteStyle === 'ENT_QUOTES') entities['39'] = '&#39;';
		entities['60'] = '&lt;';
		entities['62'] = '&gt;';
		for (decimal in entities) if (entities.hasOwnProperty(decimal)) hashMap[String.fromCharCode(decimal)] = entities[decimal];
		return hashMap;
	}

	// From http://locutus.io/php/htmlentities/
	htmlentities(string, quoteStyle, charset, doubleEncode) {
		var hashMap = this.getHtmlTranslationTable('HTML_ENTITIES', quoteStyle);
		string = string === null ? '' : string + '';
		if (!hashMap) return false;
	
		if (quoteStyle && quoteStyle === 'ENT_QUOTES') {
			hashMap["'"] = '&#039;';
		}
	
		doubleEncode = doubleEncode === null || !!doubleEncode;
	
		var regex = new RegExp('&(?:#\\d+|#x[\\da-f]+|[a-zA-Z][\\da-z]*);|[' + Object.keys(hashMap).join('').replace(/([()[\]{}\-.*+?^$|\/\\])/g, '\\$1') + ']', 'g');
	
		return string.replace(
			regex,
			function (ent) {
				if (ent.length > 1) return doubleEncode ? hashMap['&'] + ent.substr(1) : ent
				return hashMap[ent]
			}
		);
	}

	restoreSelection() {
		this.dispatchEvent(
			new Event(
				'restore-selection',
				{
					bubbles: true,
					composed: true
				}
			)
		);
	}

	sanitize(node) {
		return true;
	}

	_activeChanged() {}

	_canRedoChanged() {}

	_canUndoChanged() {}

	_commonAncestorPathChanged() {}

	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath) {}

	_debugChanged() {}

	_disabledChanged() {}

	_forceNarrowChanged() {}

	_languageChanged() {}

	_minWidth768pxChanged() {}

	_modifierChanged() {}

	_range0Changed() {}

	_selectionRootChanged() {}

	_targetChanged() {}

	_tooltipPositionChanged() {}

	_valueChanged() {}
}

customElements.define('wysiwyg-tool', WysiwygTool);
