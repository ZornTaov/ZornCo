using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ZornCoGHIO.Shared
{
    public static class MetaHelper
    {
        public class MetaModel
        {
            public MetaModel(string title, string description)
            {
                Title = title;
                Description = description;
            }
            public string Title { get; set; }
            public string Description { get; set; }
        }

        public static MetaModel GetMeta(string path)
        {
            string title = " - Brian Hoem's Portfolio";
            if (path.ToLower().StartsWith("projects"))
            {
                string[] project = path.Split("/");
                return new MetaModel(project[1] + " - " + project[2] + title, "");
            }    

            return new MetaModel("Brian Hoem's Portfolio", "");
        }
    }
}
