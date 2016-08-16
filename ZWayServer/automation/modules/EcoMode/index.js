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
				zway.devices[24].instances[2].SwitchMultilevel.Set(99);			
				//red
				zway.devices[24].instances[3].SwitchMultilevel.Set(0);
				// green	
				zway.devices[24].instances[4].SwitchMultilevel.Set(0);
				

				//FIBARO plug #1
				zway.devices[5].instances[0].SwitchBinary.Set(0);

				// Halogene Salon
				zway.devices[8].instances[0].SwitchMultilevel.Set(0);

				// POPP plug (Pi radio sdb tbb)
				//zway.devices[9].instances[0].SwitchBinary.Set(0);

				// Fibaro plug TVRdC
				zway.devices[10].instances[0].SwitchBinary.Set(0);

				//FIBARO plug #2	
				zway.devices[11].instances[0].SwitchBinary.Set(0);

				// Lumière SdBTBB
				zway.devices[14].instances[0].SwitchMultilevel.Set(0);

				// Lumière Dressing	
				zway.devices[16].instances[0].SwitchMultilevel.Set(0);

				//FIBARO plug #3	
				zway.devices[17].instances[0].SwitchBinary.Set(0);

				// Lumiere chambre
				zway.devices[18].instances[0].SwitchMultilevel.Set(0);

				// Lumiere SdB GBB
				zway.devices[19].instances[0].SwitchMultilevel.Set(0);

				// Lumiere escalier
				zway.devices[20].instances[0].SwitchMultilevel.Set(0);

				// Lumiere Entree
				zway.devices[21].instances[0].SwitchMultilevel.Set(0);

				// Lumiere Couloir Haut
				zway.devices[22].instances[0].SwitchMultilevel.Set(0);

				// Lumiere Bureau
				zway.devices[23].instances[0].SwitchMultilevel.Set(0);

				// Lumiere Garage
				zway.devices[27].instances[0].SwitchMultilevel.Set(0);
	
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
				zway.devices[24].instances[4].SwitchMultilevel.Set(99);			
				// red			
				zway.devices[24].instances[3].SwitchMultilevel.Set(0);
				// blue
				zway.devices[24].instances[2].SwitchMultilevel.Set(0);

				//FIBARO plug #1
				//zway.devices[5].instances[0].SwitchBinary.Set(255);

				// POPP plug (Pi radio sdb tbb)
				//zway.devices[9].instances[0].SwitchBinary.Set(255);

				// Fibaro plug TVRdC
				zway.devices[10].instances[0].SwitchBinary.Set(255);

				// Lumiere Entree
				zway.devices[21].instances[0].SwitchMultilevel.Set(255);

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
