using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
namespace Website.Json
{
    [JsonObject]
    public class ProjectJson
    {
        [JsonProperty("id")]
        public string Id;
        [JsonProperty("name")]
        public string Name;
        [JsonProperty("images")]
        public string[] Images;
        [JsonProperty("semester")]
        public string Semester;
        [JsonProperty("about")]
        public string About;
        [JsonProperty("whatidid")]
        public string WhatIDid;
    }
}
