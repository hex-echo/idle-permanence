using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Runtime.InteropServices;

public class TestScript : MonoBehaviour
{
    public UnityEngine.UI.Text balance_text;
    public UnityEngine.UI.Text manager_count_text;
    public UnityEngine.UI.Text manager_factor_text;
    [DllImport("__Internal")]
    private static extern void MetaFetch();
    [DllImport("__Internal")]
    private static extern void MetaInit();
    [DllImport("__Internal")]
    private static extern void MetaUpdate();

    void Start() {
        balance_text.text = "Balance: ???"; 
    }
    public void DoFetch(){
        ReceiveBalance("foo");
        MetaFetch();//balance_text.text = "Fetch";//MetaFetch();
    }
    public void DoInit(){
        MetaInit();
    }
    public void DoUpdate(){
        MetaUpdate();
    }
    public void ReceiveBalance(string s){
        balance_text.text = s;
    }
    public void ReceiveManagerCount(string s){
        manager_count_text.text = s;
    }
    public void ReceiveManagerFactor(string s){
        manager_factor_text.text = s;
    }
}