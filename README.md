# Lead

## What

**Lead** is a mobile application that allows to evaluate the amount of weight required for every dive. **Lead** implements two methods of evaluation, *Archimedes* and PADI's *Basic Weighting Guidelines*.

### Archimedes method

With this method, **Lead** evaluates the amount of weight to carry by applying the archimedes principle on the `diver body`, `set of gears` in a specific `environment`. Each element is considered as a mass and volume to compute the resulting buoyancy.

### Basic Weighting Guidelines method

With this method, **Lead** evaluates the amount of weight to carry by following the PADI's basic weighting guidelines. The result is meant to be a starting point for a buoyancy check.

## Why

The amount of weight required for a dive is important to maintain a good buoyancy. Divers are advised to follow basic weight guidelines in order to get an estimation about the amount of weight to carry and fine tune this amount through experience in each environment. Ultimately, divers should reach the perfect weighting for a given environment and keep track of it in a log book for further reference.

When diving in new conditions, divers should refer to basic weight guidelines again and start the fine tuning process.

**Lead** aims at leveraging the divers built up experience and automatically evaluate the equivalent amount of weight in different conditions.

## How

### Archimedes method

**Lead** evaluates the minimum amount of weight required so that the diver never ends up being positively buoyant during a dive with an empty BCD and lungs half full. This allows the diver to control his ascent at any time.

The minimum amount of weight is related to the maximum buoyancy which is computed using the [Archimedes' principle](https://en.wikipedia.org/wiki/Archimedes%27_principle).

```
buoyancy_max = ρ * volume_max(element) - mass_min(element)

where 
element is the diver body or a gear
ρ is the density of the water
```

The density of the water is computed via a seawater model (see [The thermophysical properties of seawater: A review of existing correlations and data](http://hdl.handle.net/1721.1/69157)) based on water temperature and salinity. 

Default values for water temprature and salinity are obtained from [NASA Open Data](http://science.nasa.gov/earth-science/oceanography/physical-ocean/salinity) based on geolocation and date.

The human body volume and density is computed via a two-compartment model (see [Fat-free mass in relation to stature: ratios of fat-free mass to height in children, adults, and elderly subjects.](http://ajcn.nutrition.org/content/53/5/1112.full.pdf)) incorporating the person gender, age, height and weight. The volume is computed for a subject holding a normal breath in his lungs.

The volume maximum and mass minimum for gears is taken or derived from data sheets.
The volume for wet suits is approximated depending on the diver surface and the wet suit thickness.

The diver's body volume is evaluated via a model.
The minimum amount of weight required is estimated by computing the following equation

```
lead_min = Σ[buoyancy_max(element, ρ)]

where 
element is the diver body or a gear
ρ is the density of the water
```

### Basic Weighting Guidelines method

The PADI's Basic Weighting Guidelines is implemented and takes into account the buoyancy of the cylinders, the type of suits, the diver fitness (computed through a model).


# Disclaimer

**Lead** provides `estimation` of the minimum amount of weight to carry in a dive.
Although **Lead** aims at being accurate, it can't be perfect. **Lead** can't take into account all details of a real environment. **Lead** is likely not free from bugs. **Lead** indications `must never` take precedence over common sense or established weight guidelines. Finally, **Lead** does not free divers from doing buoyancy checks.

By using any version of **Lead** you, you confirm to have read and that you agree with the terms of the [Apache Software License 2.0](./LICENSE).


```
Disclaimer of Warranty. Unless required by applicable law or agreed to in writing,
Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS"
BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including,
without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY,
or FITNESS FOR A PARTICULAR PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing
the Work and assume any risks associated with Your exercise of permissions under this License.
```

## Features


* Evaluates the minium amount of lead to carry for a dive
* Archimedes method
* PADI's Basic Weighting Guidelines method
* Detailed computation results
* Metric/Imperial units 
* Hydrostatic characteristics of typical gears
* Evaluation of Seawater density out of a model including `salinity` and `temperature`
* Default seawater `salinity` and `temperature` derived from  based on geolocation (selectable) and date (selectable)
* Works offline (except map)


## Technology

**Lead** is a mobile application developed on top of the following frameworks/components [Apache Cordova](https://cordova.apache.org),
[Ratchet](http://goratchet.com), [Backbone.js](http://backbonejs.org), [jQuery](https://jquery.com), [Underscore](http://underscorejs.org), [Hydro](https://github.com/wildbits/hydro).

The supported platforms are [Google Android](http://www.android.com), [Apple iOS](https://www.apple.com/ios).

## Thanks

Thanks to [JetBrains](https://www.jetbrains.com) for supporting us with [free Open Source License](https://www.jetbrains.com/buy/opensource) of its [IntelliJ IDEA](https://www.jetbrains.com/idea) product.



## Misc

Icons are credit of [roundicons.com](http://roundicons.com) with slight modifications as allowed by their [license](http://roundicons.com/usage-license).