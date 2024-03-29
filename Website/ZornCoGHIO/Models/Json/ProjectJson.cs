﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
namespace Website.Json
{
    [JsonObject]
    public class Projects
    {
        [JsonProperty("unity")]
        public Project[] Unity;
        [JsonProperty("unreal")]
        public Project[] Unreal;
        [JsonProperty("minecraft")]
        public Project[] Minecraft;
        [JsonProperty("other")]
        public Project[] Other;
    }



    [JsonObject]
    public class Project
    {
        [JsonProperty("id")]
        public string Id;
        [JsonProperty("name")]
        public string Name;
        [JsonProperty("images")]
        public string[] Images;
        [JsonProperty("youtube")]
        public string Youtube;
        [JsonProperty("year")]
        public string Year;
        [JsonProperty("about")]
        public string About;
        [JsonProperty("whatidid")]
        public string WhatIDid;
        [JsonProperty("speciallink")]
        public string SpecialLink;
        [JsonProperty("sourcelink")]
        public string SourceLink;
    }
}
