#pragma strict

var target : Transform;
var distance = 400.0;
 
var xSpeed = 1.1;
var ySpeed = 120.0;
 
var yMinLimit = 10;
var yMaxLimit = 80;
 
var distanceMin = 20;
var distanceMax = 500;
 
private var x = 0.0;
private var y = 0.0;

/*
dist 150
x speed 2
dist min 150
dist max 200
*/

function Start () {
    var angles = transform.eulerAngles;
    x = angles.y;
    y = angles.x;
 
	// Make the rigid body not change rotation
   	if (GetComponent.<Rigidbody>())
		GetComponent.<Rigidbody>().freezeRotation = true;
}
 
function LateUpdate () {
    if (target) {
        x += Input.GetAxis("Mouse X") * xSpeed * distance * 0.02;
        y -= Input.GetAxis("Mouse Y") * ySpeed * 0.02;
 
 		y = ClampAngle(y, yMinLimit, yMaxLimit);
 
		var rotation = Quaternion.Euler(y, x, 0);
 
		distance = Mathf.Clamp(distance - Input.GetAxis("Mouse ScrollWheel"), distanceMin, distanceMax);
 
		var hit : RaycastHit;
		if (Physics.Linecast (target.position, transform.position, hit)) {
				distance -=  hit.distance;
		}
 
        var position = rotation * Vector3(0.0, 0.0, -distance) + target.position;
 
        transform.rotation = rotation;
        transform.position = position;
 
	}
 
}
 
static function ClampAngle (angle : float, min : float, max : float) {
	if (angle < -360)
		angle += 360;
	if (angle > 360)
		angle -= 360;
	return Mathf.Clamp (angle, min, max);
}