// Copyright (c) 2014-2017, MyMonero.com
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
//	conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
//	of conditions and the following disclaimer in the documentation and/or other
//	materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be
//	used to endorse or promote products derived from this software without specific
//	prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
"use strict"
//
const View = require('../../Views/View.web')
//
const passwordEntryTaskModes =
{
	None: 'None',
	//
	ForUnlockingApp_ExistingPasswordGivenType : 'ForUnlockingApp_ExistingPasswordGivenType',
	ForFirstEntry_NewPasswordAndType		  : 'ForFirstEntry_NewPasswordAndType',
	//
	ForChangingPassword_ExistingPasswordGivenType : 'ForChangingPassword_ExistingPasswordGivenType',
	ForChangingPassword_NewPasswordAndType		  : 'ForChangingPassword_NewPasswordAndType'
}
//
class PasswordEntryView extends View
{
	constructor(options, context)
	{
		super(options, context)
		//
		const self = this
		self.setup()
	}
	setup()
	{
		const self = this
		//
		self.passwordEntryTaskMode = passwordEntryTaskModes.None
		//
		self._setup_views()
		self._setup_startObserving()
		//
	}
	_setup_views()
	{
		const self = this
		self.layer.style.position = "fixed"
		self.layer.style.top = "0"
		self.layer.style.left = "0"
		self.layer.style.width = "100%"
		self.layer.style.height = "100%"
		self.layer.style.zIndex = "9999"
		self.layer.style.border = "0px solid orange" // for debug
		self.layer.style.background = "#ccc"
		self.layer.innerHTML = "<h3>Enter password:</h3>"
	}
	_setup_startObserving()
	{
		const self = this
	}
	//
	//
	// Runtime - Accessors - Products
	//
	PasswordEnteredInView()
	{
		const self = this
		// TODO: read this directly from the UI,
		// v-- mocked for now
		return "a much stronger password than before"
	}
	PasswordTypeSelectedInView()
	{
		const self = this
		// TODO: read this directly from the UI,
		// v-- mocked for now
		return self.context.passwordController.AvailableUserSelectableTypesOfPassword().FreeformStringPW
	}
	//
	//
	// Runtime - Accessors - UI state
	//	
	IsPresented()
	{
		const self = this
		const v = typeof self.superview !== "undefined" && self.superview !== null
		//
		return v ? true : false
	}
	//
	//
	// Runtime - Imperatives - Interface - Showing the view
	//
	GetUserToEnterExistingPasswordWithCB(
		inSuperview,
		isForChangePassword,
		existingPasswordType,
		enterPassword_cb
		// TODO: add flag for whether this is for a change pw
	)
	{
		const self = this
		const isAlreadyPresented = self.IsPresented()
		const shouldAnimateToNewState = isAlreadyPresented === true
		{ // check legality
			if (self.passwordEntryTaskMode !== passwordEntryTaskModes.None) {
				throw "GetUserToEnterExistingPasswordWithCB called but self.passwordEntryTaskMode not .None"
				return
			}
			if (isForChangePassword === true) {
				if (isAlreadyPresented === false) {
					throw "GetUserToEnterExistingPasswordWithCB with ForChangingPassword taskMode but not currently presented"
					return
				}
			} else {
				if (isAlreadyPresented === true) {
					throw "GetUserToEnterExistingPasswordWithCB with ForFirstEntry taskMode but already presented"
					return
				}
			}
			//
			if (typeof self.enterPasswordAndType_cb !== 'undefined' && self.enterPasswordAndType_cb !== null) {
				throw "GetUserToEnterExistingPasswordWithCB called but self.enterPasswordAndType_cb not null"
				return
			}
			if (typeof self.enterPassword_cb !== 'undefined' && self.enterPassword_cb !== null) {
				throw "GetUserToEnterExistingPasswordWithCB called but self.enterPassword_cb not null"
				return
			}
		}
		{ // we need to hang onto the callback for when the form is submitted
			self.enterPassword_cb = enterPassword_cb
		}
		{ // put view into mode
			let taskMode;
			if (isForChangePassword === true) {
				taskMode = passwordEntryTaskModes.ForChangingPassword_ExistingPasswordGivenType
			} else {
				taskMode = passwordEntryTaskModes.ForUnlockingApp_ExistingPasswordGivenType
			}
			self.passwordEntryTaskMode = taskMode
			//
			self._configureWithMode(shouldAnimateToNewState)			
		}
		{ // presentation
			if (isAlreadyPresented !== true) { // this doesn't conflict with the order of the call to _configureWithMode() because
				// shouldAnimateToNewState will be false when the view does not need to be presented
				self.presentInView(inSuperview)			
			}
		}
		
		
		
		
		
		// MOCKED PASSWORD ENTRY:		
		setTimeout(
			function()
			{ 
				self.submitForm()
			},
			1000
		)		
		
		
		
		
		
		
	}
	GetUserToEnterNewPasswordAndTypeWithCB(
		inSuperview,
		isForChangePassword,
		enterPasswordAndType_cb
		// TODO: add flag for whether this is for a change pw
	)
	{
		const self = this
		const isAlreadyPresented = self.IsPresented()
		const shouldAnimateToNewState = isAlreadyPresented === true
		{ // check legality
			if (self.passwordEntryTaskMode !== passwordEntryTaskModes.None) {
				throw "GetUserToEnterNewPasswordAndTypeWithCB called but self.passwordEntryTaskMode not .None"
				return
			}
			if (isForChangePassword === true) {
				if (isAlreadyPresented === false) {
					throw "GetUserToEnterNewPasswordAndTypeWithCB with ForChangingPassword taskMode but not currently presented"
					return
				}
			} else {
				if (isAlreadyPresented === true) {
					throw "GetUserToEnterNewPasswordAndTypeWithCB with ForFirstEntry taskMode but already presented"
					return
				}
			}
			//
			if (self.enterPasswordAndType_cb !== null && typeof self.enterPasswordAndType_cb !== null) {
				throw "GetUserToEnterExistingPasswordWithCB called but self.enterPasswordAndType_cb not null"
				return
			}
			if (self.enterPassword_cb !== null && typeof self.enterPassword_cb !== null) {
				throw "GetUserToEnterExistingPasswordWithCB called but self.enterPassword_cb not null"
				return
			}
		}
		{ // we need to hang onto the callback for when the form is submitted
			self.enterPasswordAndType_cb = enterPasswordAndType_cb
		}
		{ // put view into mode
			let taskMode;
			if (isForChangePassword === true) {
				taskMode = passwordEntryTaskModes.ForChangingPassword_NewPasswordAndType
			} else {
				taskMode = passwordEntryTaskModes.ForFirstEntry_NewPasswordAndType
			}
			self.passwordEntryTaskMode = taskMode
			//
			self._configureWithMode(shouldAnimateToNewState)			
		}
		{ // presentation
			if (isAlreadyPresented !== true) { // this doesn't conflict with the order of the call to _configureWithMode() because
				// shouldAnimateToNewState will be false when the view does not need to be presented
				self.presentInView(inSuperview)			
			}
		}
		
		
		
		
		
		// MOCKED PASSWORD ENTRY:		
		setTimeout(
			function()
			{ 
				self.submitForm()
			},
			1000
		)		
		
		
		
	}
	//
	//
	// Runtime - Imperatives - Interface - Intra-task configuration
	//	
	ShowValidationErrorMessageToUser(validationMessageString)
	{
		const self = this
		self._setValidationMessage(validationMessageString)
	}
	//
	//
	// Runtime - Imperatives - Interface - Dismissing the view
	//
	Dismiss()
	{
		const self = this
		if (typeof self.superview === 'undefined' || self.superview === null) {
			console.error("Can't  dismiss password entry view as not in a superview")
			return
		}
		// TODO: animation
		self.viewWillDisappear()
		self.removeFromSuperview()
	}
	//
	//
	// Runtime - Imperatives - Internal - Showing the view - Utilities
	//
	presentInView(superview)
	{
		const self = this
		self.viewWillAppear()
		superview.addSubview(self)
	}
	//
	//
	// Runtime - Imperatives - Internal - View configuration
	//
	_configureWithMode(shouldAnimate)
	{
		const self = this
		if (typeof shouldAnimate === 'undefined') {
			shouldAnimate = false
		}
		{ // prepare for reuse
			self._clearValidationMessage()
		}
		switch (self.passwordEntryTaskMode) {
			default:
				console.log("TODO: configure with mode", self.passwordEntryTaskMode)
		}
	}
	_setValidationMessage(validationMessageString)
	{
		const self = this
		console.log("TODO _setValidationMessage", validationMessageString)
		// TODO:
		// self.validationMessage_LabelView.innerHTML = `<span>${validationMessageString}</span>`
	}
	_clearValidationMessage()
	{
		const self = this
		console.log("TODO _clearValidationMessage")
		// TODO:
		// self.validationMessage_LabelView.innerHTML = ''
	}	
	//
	//
	// Runtime - Imperatives - Internal - Form management
	//
	submitForm()
	{
		const self = this
		// handles validation:
		self._passwordController_callBack_trampoline(
			false, // didCancel
			self.PasswordEnteredInView(),
			self.PasswordTypeSelectedInView()
		)
	}
	cancel()
	{
		const self = this // We don't need to call .Dismiss here because the cancel will be picked up by the PasswordEntryViewController
		self._passwordController_callBack_trampoline(
			true, // didCancel
			undefined,
			undefined
		)
	}	
	_passwordController_callBack_trampoline(didCancel, password_orNil, passwordType_orNil)
	{
		const self = this
		//
		let enterPassword_cb = self.enterPassword_cb
		let enterPasswordAndType_cb = self.enterPasswordAndType_cb
		{ // might as well free these now that we're holding onto them
			self.enterPassword_cb = null
			self.enterPasswordAndType_cb = null
		}
		switch (self.passwordEntryTaskMode) {
			case passwordEntryTaskModes.ForUnlockingApp_ExistingPasswordGivenType:
			case passwordEntryTaskModes.ForChangingPassword_ExistingPasswordGivenType:
				console.log("1cb for mode", self.passwordEntryTaskMode)
				{ // validate cb state
					if (typeof enterPasswordAndType_cb !== 'undefined' && enterPasswordAndType_cb !== null) {
						throw "PasswordEntryView/_passwordController_callBack_trampoline: had a enterPasswordAndType_cb for passwordEntryTaskMode: " + self.passwordEntryTaskMode
						return
					}
					if (typeof enterPassword_cb === 'undefined' || enterPassword_cb === null) {
						throw "PasswordEntryView/_passwordController_callBack_trampoline: missing enterPassword_cb for passwordEntryTaskMode: " + self.passwordEntryTaskMode
						return
					}					
				}
				enterPassword_cb(
					didCancel,
					password_orNil
				)
				break
			//
			case passwordEntryTaskModes.ForFirstEntry_NewPasswordAndType:
			case passwordEntryTaskModes.ForChangingPassword_NewPasswordAndType:
				console.log("2cb for mode", self.passwordEntryTaskMode)
				{ // validate cb state
					if (typeof enterPassword_cb !== 'undefined' && enterPassword_cb !== null) {
						throw "PasswordEntryView/_passwordController_callBack_trampoline: had a enterPassword_cb for passwordEntryTaskMode: " + self.passwordEntryTaskMode
						return
					}
					if (typeof enterPasswordAndType_cb === 'undefined' || enterPasswordAndType_cb === null) {
						throw "PasswordEntryView/_passwordController_callBack_trampoline: missing enterPasswordAndType_cb for passwordEntryTaskMode: " + self.passwordEntryTaskMode
						return
					}					
				}
				enterPasswordAndType_cb(
					didCancel,
					password_orNil,
					passwordType_orNil
				)
				break
			//
			case passwordEntryTaskMode.None:
				throw "_passwordController_callBack_trampoline called when self.passwordEntryTaskMode .None"
				return
				break
			//
			default:
				throw "This switch ought to have been exhaustive"
				return
				break
		}
	}
	//
	//
	// Runtime - Delegation - Visibility cycle
	//
	viewWillAppear()
	{
		const self = this
		console.log("Password entry view will appear")
	}
	viewWillDisappear()
	{
		const self = this
		console.log("Password entry view will disappear")
	}
	viewDidDisappear()
	{
		const self = this
		self.passwordEntryTaskMode = passwordEntryTaskModes.None // reset/clear
	}
}
module.exports = PasswordEntryView
