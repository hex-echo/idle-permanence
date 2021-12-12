using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class JumperScript : MonoBehaviour
{
    public Transform wall_transform_1;
    public Transform wall_transform_2;
    public Transform wall_transform_3;
    Vector2 velocity;
    public float kickoff_x = 3.0f;
    public float kickoff_y = 2.0f;
    Vector2 acceleration;
    public float gravity = -0.98f;
    public float drag_factor = 1.0f;
    bool is_flipping = false;
    float flip_velocity = 0;
    public float flip_chance = 0.3f;
    // Start is called before the first frame update
    void Start() {
        velocity = new Vector2(kickoff_x, kickoff_y);
    }

    // Update is called once per frame
    void Update() {
        transform.position = new Vector3(
            transform.position.x + velocity.x * Time.deltaTime,
            0,//transform.position.y + velocity.y * Time.deltaTime,
            0);
        velocity = velocity + acceleration * Time.deltaTime;
        acceleration = new Vector2(Mathf.Sign(velocity.x) * -1 * drag_factor, gravity); 
        MoveWalls();
        TryFlip();
    }
    void MoveWalls(){
        wall_transform_1.Translate(new Vector3( 0, -1 *  velocity.y * Time.deltaTime, 0)); 
        wall_transform_2.Translate(new Vector3( 0, -1 *  velocity.y * Time.deltaTime, 0)); 
        wall_transform_3.Translate(new Vector3( 0, -1 *  velocity.y * Time.deltaTime, 0)); 
        if(wall_transform_1.position.y <= -12 ) wall_transform_1.Translate(0, 30, 0);
        if(wall_transform_2.position.y <= -12 ) wall_transform_2.Translate(0, 30, 0);
        if(wall_transform_3.position.y <= -12 ) wall_transform_3.Translate(0, 30, 0);
    }
    void TryFlip(){
        if(is_flipping){
            float angle = Mathf.Lerp(25, 335, 1 - (transform.position.x + 1.5f) / 3f);
            Debug.Log(angle.ToString() + " ----- " + ((transform.position.x + 1.5f) / 3f).ToString());
            transform.eulerAngles = new Vector3(0, 0, angle);
            //transform.Rotate(0,0,90 * Time.deltaTime * flip_velocity);
            //if(Mathf.Abs(transform.rotation.eulerAngles.z) < 3){
            //    transform.Rotate(new Vector3(0, 0, -1 * transform.rotation.eulerAngles.z));
            //    is_flipping = false;
            //    flip_velocity = 0;   
            //}
        }
    }

    void OnTriggerEnter2D(Collider2D col) {
        if(col.gameObject.name == "right_collider"){
            velocity = new Vector2(-1f * kickoff_x, kickoff_y);
            if(transform.position.x > 1.5f && Random.Range(0f,1f) < flip_chance){
                Debug.Log("Flip from right");
                is_flipping = true;
                flip_velocity = (transform.position.x + 1.5f) * 1.5f; 
            } 
        }
        else{
            velocity = new Vector2(kickoff_x, kickoff_y);
            if(transform.position.x < -1.5f && Random.Range(0f,1f) < flip_chance){
                Debug.Log("Flip from left");
                is_flipping = true;
                flip_velocity = -1f * (1.5f - transform.position.x) * 1.5f; 
            } 
        }
    }
}
