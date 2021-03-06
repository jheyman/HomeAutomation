/*** EcoMode Z-Way HA module *******************************************

Version: 0.0.1
-----------------------------------------------------------------------------
Author: Julien Heyman <bidsomail@gmail.com>
Description:
   Turn off a set of devices upon receiving a specific trigger (scene activation
   from a wall switch controller = enter eco mode), turn on another set of devices
   upon receiving another scene activation (= turn off eco mode)
******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function EcoMode (id, controller) {
    // Call superconstructor first (AutomationModule)
    EcoMode.super_.call(this, id, controller);
}

inherits(EcoMode, AutomationModule);

_module = EcoMode;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

function setBinaryDevice(id, instance, level) {
	if (zway.devices[id] != null) {
		console.log("EcoMode: setting dev ", id, ", instance ", instance, " to level " , level);
		zway.devices[id].instances[instance].SwitchBinary.Set(level);
	} else {
		console.log("EcoMode: NULL object trying to set dev ", id, ", instance ", instance, " to level " , level);
	}
}

function setMultiLevelDevice(id, instance, level) {
	if (zway.devices[id] != null) {
		console.log("EcoMode: setting dev ", id, ", instance ", instance, " to level " , level);
		zway.devices[id].instances[instance].SwitchMultilevel.Set(level);
	} else {
		console.log("EcoMode: NULL object trying to set dev ", id, ", instance ", instance, " to level " , level);
	}
}

EcoMode.prototype.init = function (config) {
    EcoMode.super_.prototype.init.call(this, config);

    var self = this;

	zway.devices[1].instances[0].commandClasses[43].data.currentScene.bind(function(){
		var value = zway.devices[1].instances[0].commandClasses[43].data.currentScene.value;
		console.log("EcoMode: SCENE detected = ", value);

		if (self.timer) {
		    // Timer is set, so we destroy it
		    clearTimeout(self.timer);
		}
		
		if (value === 2) {
			
			try {
				// Turn on the LED (full blue) to show ongoing transition to ECO mode
				//blue
				setMultiLevelDevice(24,2,99)
				//red
				setMultiLevelDevice(24,3,0)
				// green	
				setMultiLevelDevice(24,4,0)

				//FIBARO plug #1 / prise salon table
				setBinaryDevice(5,0,0)

				//FIBARO plug #2 / Halogene salon
				setBinaryDevice(11,0,0)

				//FIBARO plug #3 / Strip LED bibliothèque
				setBinaryDevice(17,0,0)

				// Halogene Salon
				setMultiLevelDevice(8,0,0)

				// Fibaro plug TVRdC
				setBinaryDevice(10,0,0)

				// Lumière SdBTBB
				setMultiLevelDevice(14,0,0)

				// Lumière Dressing	
				setMultiLevelDevice(16,0,0)

				// Lumiere chambre
				setMultiLevelDevice(18,0,0)

				// Lumiere SdB GBB
				setMultiLevelDevice(19,0,0)

				// Lumiere escalier
				setMultiLevelDevice(20,0,0)

				// Lumiere Entree
				setMultiLevelDevice(21,0,0)

				// Lumiere Couloir Haut
				setMultiLevelDevice(22,0,0)

				// Lumiere Bureau
				setMultiLevelDevice(23,0,0)

				// Lumiere Garage
				setMultiLevelDevice(27,0,0)

			console.log("EcoMode is now ON ");
			}
			catch(e) {
				console.log("EcoMode ON exception!");
			}
			finally {
				// Turn LED back off to show completion (after 2 second delay)
			    self.timer = setTimeout(function () {
				// RGB notification
				zway.devices[24].instances[2].SwitchMultilevel.Set(0);
				self.timer = null;
			    }, 2*1000);
			}

	    } else if (value === 1) {
			try {
				// Turn on the LED (full green) to show ongoing transition out of ECO mode
				// green
				setMultiLevelDevice(24,4,99)
				// red			
				setMultiLevelDevice(24,3,0)
				// blue
				setMultiLevelDevice(24,2,0)

				// Lampe table salon
				setMultiLevelDevice(8,0,255)

				//FIBARO plug #1 / prise salon table
				setBinaryDevice(5,0,255)

				//FIBARO plug #2 / Halogene salon
				setBinaryDevice(11,0,255)

				//FIBARO plug #3 §trip LED bibliothèque
				setBinaryDevice(17,0,255)

				// Fibaro plug TVRdC
				setBinaryDevice(10,0,255)

				// Lumiere Entree
				setMultiLevelDevice(21,0,255)

				console.log("EcoMode is now OFF");
			}
			catch(e) {
				console.log("EcoMode OFF exception!");
			}
			finally {
			// Turn LED back off to show completion (after 2 second delay)
			    self.timer = setTimeout(function () {
				zway.devices[24].instances[4].SwitchMultilevel.Set(0);
				self.timer = null;
			    }, 2*1000);
			}
	    } else {
			console.log("EcoMode: unknown scene (", value, "): IGNORING");		
		}
	});
};

EcoMode.prototype.stop = function () {
    var self = this;
    
    this.controller.devices.filter(function(xDev) {
        return in_array(self.config.sourceDevices, xDev.id);
    }).map(function (yDev) {
        self.controller.devices.get(yDev.id).off('change:metrics:level', self.handlerLevel);
    });
    this.controller.devices.filter(function(xDev) {
        return in_array(self.config.sourceDevices, xDev.id);
    }).map(function (yDev) {
        self.controller.devices.get(yDev.id).off('change:metrics:change', self.handlerChange);
    });

    EcoMode.super_.prototype.stop.call(this);
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------
