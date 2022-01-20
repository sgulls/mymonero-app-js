"use strict"

const EventEmitter = require('events')

class MenuController extends EventEmitter
{
	constructor(options, context)
	{
		super() // must call before accessing `this`
		//
		const self = this
		self.options = options
		self.context = context
		//
		self.setup()
	}
	setup()
	{
		const self = this
	}

	
	////////////////////////////////////////////////////////////////////////////////
	// Runtime - Accessors - Event Names
	
	EventName_menuItemSelected_ChangePassword()
	{
		return "EventName_menuItemSelected_ChangePassword"
	}
	EventName_menuItemSelected_Preferences()
	{
		return "EventName_menuItemSelected_Preferences"
	}
	

	////////////////////////////////////////////////////////////////////////////////
	// Runtime - Imperatives
	
	SetItemNamedEnabled(itemName, isEnabled)
	{
		isEnabled = typeof isEnabled === 'string' ? isEnabled == 'true' : isEnabled // to support IPC on windows… apparently cannot pass booleans
		const self = this
		self.override_setItemNamedEnabled(itemName, isEnabled)
	}
	override_setItemNamedEnabled(itemName, isEnabled)
	{
		const self = this
		throw `You must implement setItemNamedEnabled in ${self.constructor.name}`
	}
	

	////////////////////////////////////////////////////////////////////////////////
	// Runtime - Delegation
}
module.exports = MenuController
