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
    bool flip_start_right = false;
    public float flip_chance = 0.05f;
    float total_height = 0;
    float current_height = 0;
    public UnityEngine.UI.Text total_score_text;
    public UnityEngine.UI.Text balance_text;
    public UnityEngine.UI.Text jump_force_y_text;
    public UnityEngine.UI.Button jump_force_y_button;
    public UnityEngine.UI.Text jump_force_y_button_text;
    float jump_force_y_upgrade_count = 0;
    public float jump_force_y_rate = 1.1f;
    public UnityEngine.UI.Text flip_chance_text;
    public UnityEngine.UI.Button flip_chance_button;
    public UnityEngine.UI.Text flip_chance_button_text;
    float flip_chance_upgrade_count = 0;
    public float flip_chance_rate = 1.1f;
    // Start is called before the first frame update
    void Start() {
        velocity = new Vector2(kickoff_x, kickoff_y);
        UpdateUI();
    }
    // Update is called once per frame
    void Update() {
        transform.position = new Vector3( transform.position.x + velocity.x * Time.deltaTime, 0, 0);
        velocity = velocity + acceleration * Time.deltaTime;
        acceleration = new Vector2(Mathf.Sign(velocity.x) * -1 * drag_factor, gravity); 
        UpdateScores();
        MoveWalls();
        TryFlip();
    }
    void UpdateScores(){
        float delta_y = velocity.y * Time.deltaTime;
        total_height += delta_y;
        if(delta_y > 0){
            current_height += delta_y;
            UpdateUI();
        }
        total_score_text.text = total_height.ToString("F2");
        balance_text.text = current_height.ToString("F2");
    }
    void MoveWalls(){
        float delta_y = -1 *  velocity.y * Time.deltaTime;
        wall_transform_1.Translate(new Vector3( 0, delta_y, 0)); 
        wall_transform_2.Translate(new Vector3( 0, delta_y, 0)); 
        wall_transform_3.Translate(new Vector3( 0, delta_y, 0)); 
        if(wall_transform_1.position.y <= -12 ) wall_transform_1.Translate(0, 30, 0);
        if(wall_transform_2.position.y <= -12 ) wall_transform_2.Translate(0, 30, 0);
        if(wall_transform_3.position.y <= -12 ) wall_transform_3.Translate(0, 30, 0);
    }
    void TryFlip(){
        if(is_flipping){
            float lerp_value = 1 - (transform.position.x + 1.5f) / 3f;
            float angle = Mathf.Lerp(25, 335, lerp_value);
            transform.eulerAngles = new Vector3(0, 0, angle);
            if((flip_start_right && lerp_value > 0.98) || (!flip_start_right && lerp_value < 0.02)){
                is_flipping = false;
            }
        }
        else{
            float lerp_value = (transform.position.x + 1.5f) / 3f;
            float angle = Mathf.Lerp(-25, 25, lerp_value);
        }
    }
    void OnTriggerEnter2D(Collider2D col) {
        if(col.gameObject.name == "right_collider"){
            velocity = new Vector2(-1f * kickoff_x, kickoff_y);
            if(transform.position.x > 1.5f){
                if(Random.Range(0f,1f) < flip_chance){
                    is_flipping = true;
                    flip_start_right = true;
                    velocity = new Vector2(-1f * kickoff_x, 2 * kickoff_y);
                } 
                else{
                    transform.eulerAngles = new Vector3(0, 0, 25);
                }
            }
        }
        else{
            velocity = new Vector2(kickoff_x, kickoff_y);
            if(transform.position.x < -1.5f){
                if(Random.Range(0f,1f) < flip_chance){
                    is_flipping = true;
                    flip_start_right = false;
                    velocity = new Vector2(kickoff_x, 2 * kickoff_y);
                }
                else{
                    transform.eulerAngles = new Vector3(0, 0, -25);
                }
            } 
        }
    }
    public void UpdateUI(){
        UpdateJumpForceYUI();
        UpdateFlipChanceUI();
    }
    float GetCost_JumpForceY(){
        return 2f * Mathf.Pow(jump_force_y_rate, jump_force_y_upgrade_count);
    }
    public void Upgrade_JumpForceY(){
        kickoff_y += 0.05f;
        jump_force_y_upgrade_count += 1;
        float upgrade_cost = GetCost_JumpForceY();
        current_height -= upgrade_cost;
        UpdateJumpForceYUI();
    }
    void UpdateJumpForceYUI(){
        jump_force_y_text.text = kickoff_y.ToString("F2");
        float upgrade_cost = GetCost_JumpForceY();
        jump_force_y_button_text.text = upgrade_cost.ToString("F2");       
        if(current_height > upgrade_cost) jump_force_y_button.interactable = true;
        else jump_force_y_button.interactable = false;
    }
    float GetCost_FlipChance(){
        return 2f * Mathf.Pow(flip_chance_rate, flip_chance_upgrade_count);
    }
    public void Upgrade_FlipChance(){
        flip_chance += 0.01f;
        flip_chance_upgrade_count += 1;
        float upgrade_cost = GetCost_FlipChance();
        current_height -= upgrade_cost;
        UpdateFlipChanceUI();
    }
    void UpdateFlipChanceUI(){
        flip_chance_text.text = flip_chance.ToString("F2");
        float upgrade_cost = GetCost_FlipChance();
        flip_chance_button_text.text = upgrade_cost.ToString("F2");       
        if(current_height > upgrade_cost) flip_chance_button.interactable = true;
        else flip_chance_button.interactable = false;
    }
}
