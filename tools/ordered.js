import {html} from '@polymer/lit-element/lit-element.js';
import {WysiwygTool} from '../wysiwyg-tool.js';
import '@polymer/iron-a11y-keys';
import '@polymer/paper-tooltip';
import '../wysiwyg-localize.js';
import '../wysiwyg-tool-button.js';

export class WysiwygToolOrdered extends WysiwygTool {
	constructor() {
		super();

		this.resources = {
			'br': {
				'Ordered List': 'Lista ordenada'
			},
			'en': {
				'Ordered List': 'Ordered List'
			},
			'fr': {
				'Ordered List': 'Liste ordonnée'
			},
			'de': {
				'Ordered List': 'Geordnete Liste'
			}
		};

		this.allowedTagNames = ['OL', 'LI'];
	}

	ordered() {
		if (this._computeDisabled(this.range0, this.selectionRoot, this.value, this.commonAncestorPath)) return;
		document.execCommand('insertOrderedList');
	}

	_computeActive(range0, selectionRoot, value, commonAncestorPath) {
		if (!range0) return false;
		return document.queryCommandState('insertOrderedList');
	}

	_computeDisabled(range0, selectionRoot, value, commonAncestorPath) {
		if (!range0) return true;
		return !document.queryCommandEnabled('insertOrderedList');
	}

	_render({target, stringKey, resources, language, tooltipPosition, modifier, range0, selectionRoot, value, commonAncestorPath}) {
		return html`
			<wysiwyg-tool-button id="button" icon="format_list_numbered" on-mousedown="${(e) => this.ordered()}" active="${this._computeActive(range0, selectionRoot, value, commonAncestorPath)}" disabled="${this._computeDisabled(range0, selectionRoot, value, commonAncestorPath)}"></wysiwyg-tool-button>
			<paper-tooltip id="tooltip" for="button" position="${tooltipPosition}" offset="5">
				<wysiwyg-localize language="${language}" resources="${resources}" stringKey="${'Ordered List'}"></wysiwyg-localize>
				<span> (Shift + Alt + O)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="${target}" keys="shift+alt+o" on-keys-pressed="${(e) => this.ordered()}"></iron-a11y-keys>
		`;
	}
}

customElements.define('wysiwyg-tool-ordered', WysiwygToolOrdered);	