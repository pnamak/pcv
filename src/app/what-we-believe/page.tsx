import { PageHeader } from "@/components/PageHeader";

const sections = [
  {
    title: null,
    paragraphs: [
      "Brothers and sisters in the Presbyterian Church of Vanuatu: We believe that, this Church of ours is part of the Church of Jesus Christ founded by the first apostles. The Church of Jesus Christ is one, Holy Pure and Universal. The Church is one because there is only one God, who is father of all people, because there is only one Lord Jesus Christ: and because there is only one Spirit, the Holy Spirit: and because there is only one faith: only one Baptism, uniting all people from all places.",
      "The Church is Holy because her Lord has set her apart in the world, so that the Church might worship him and carry out His Mission and Ministry in the world.",
      "The Church is Universal because everyone must obey the one who is Lord, and because when people join the Church, nothing can separate them again. This is the same Church as the one founded in the beginning, by the first disciples. It is founded upon the Word of Jesus Christ, who was nailed to the cross, and died, whom God raised from the dead, with the message spoken by the apostles from the beginning, and because the Church proclaims the same message as the one preached by the apostles to all people.",
      "In this Church of ours, we Worship God who is three persons, but only one God, the Father, the Son, the Holy Spirit, one God.",
    ],
  },
  {
    title: "God the Father",
    paragraphs: [
      "We believe that God the Father made all things, and all things find their true purpose when they serve him.",
    ],
  },
  {
    title: "God the Son",
    paragraphs: [
      "We believe that God the Father loved the world so much that he sent his only Son, Jesus Christ to be in the world as one of us, to reveal many things to us; in Jesus, God has shown the way of his love for people, that they might know this love. In Jesus, God has broken the power of devils, silencing them, so that they no longer have the power to defeat Jesus.",
      "In Jesus, God has made the true sacrifice, sufficient to take away the sin of the world. In Jesus, God has shown that the true way of power is through the Holy Spirit who leads us, so that we obey God who is our Father.",
      "In Jesus, everyone who has gone astray has been reconciled again to God, everyone who has done wrong has been forgiven by God, who has taken away their sins, everyone who is sick has been restored again by God, everyone who is divided and enemies with each other has been united by God and lives in His Peace.",
      "Because Jesus in all things remained faithful to His Father, and His Father is King, Jesus has all power, and rules our life and the world to come. His Father raised him from the dead and received Him again to be with Him.",
      "God has made Jesus the Chief of all Chiefs, and the King of all Kings; he alone is to be given all honor. He will come back again in the power of God the Father, to judge the dead and the living.",
    ],
  },
  {
    title: "God the Holy Spirit",
    paragraphs: [
      "We believe that the Holy Spirit was present in the beginning, when God brought the world into being. He is the power of life of the man Jesus Christ, who was nailed to the cross and died, whom God raised again from the dead.",
      "God the Father sent the Holy Spirit into the world, so that all people might believe in Jesus Christ, and received the new life in him. The work of the Holy Spirit is to change all people, to make them disciples of Christ, to lead all people into obedience of God, so that they might know the fullness of new life which Jesus gives through his resurrection from the dead.",
    ],
  },
  {
    title: "The Church",
    paragraphs: [
      "We believe that the Church of Jesus Christ is the fellowship of the Holy Spirit which unites her people to make them into one family. All the people in this fellowship proclaim Jesus Christ as the Lord of all, and the only Head of the Church. The work of the Church is always to proclaim in every place, that Jesus Christ alone is the Lord of all, and everyone must obey him. Whenever the Church proclaims this message, Jesus Christ sends the Holy Spirit to renew the Church and to give the Church everything she needs to do His work in the world. At all times, the Church looks into the future, when the new world, the Kingdom of God will come, and transform heaven and earth, so that both no longer exist. In this world to come, there will be no more suffering, no more sickness, no more death. In this world to come, everyone will proclaim Jesus as Lord of all, and Chief of all, to the Glory of God our Father.",
    ],
  },
  {
    title: "The Bible",
    paragraphs: [
      "We believe the message of the Old and New Testaments is the word of God, given the Holy Spirit for people to write down. This message, the faith of the people of God and their way of life, is inspired by the Holy Spirit. The message of the Bible is the basis of the Faith of the Church. The Church at all times preaches from this message, and teaches this message to all people. This message at all times rules the work of the Church and its way of life in the world. Jesus Christ is the Word of God, and He is the Word of life. At all times, He uses the message of the Bible to shape the life of his people, and to make them strong.",
    ],
  },
  {
    title: "The Two Sacraments",
    paragraphs: [
      "We believe that there are two Sacraments which the Church must celebrate, Baptism and the Lord's Supper. The Lord's Supper is sometimes call 'Communion'. We believe that both Sacraments are given by Christ to His Church to make known His example and His message. The Church believes that these two are Sacraments, because she believes that when we celebrate either of them, Jesus is present with His people and through them, the work of Salvation in the world which He began before is renewed among his people. Through Baptism, Christ brings people into union with His Body, which is His Church, through the Lords Supper he strengthens the faith of His people, he renews their commitment to Him, and deepens their love from Him.",
    ],
  },
  {
    title: "Conclusion",
    paragraphs: [
      "The above statement is the basic Faith of those who are members of the Presbyterian Church of Vanuatu. We acknowledge that if anyone has any different views that do not contradict this basic statement of faith, that is acceptable and we are free to have such views.",
      "Also we acknowledge if the Assembly of the Presbyterian Church follows its Constitution, she has the right to set down any word it chooses for her members to obey, and the right to change such words as it chooses, and everyone in government or custom has no authority to change this.",
    ],
  },
];

export default function WhatWeBelievePage() {
  return (
    <div className="page-container max-w-3xl">
      <PageHeader
        title="What We Believe"
        description="Presbyterian Church of Vanuatu Statement of Faith"
      />

      <article className="space-y-8">
        {sections.map((section, index) => (
          <section
            key={section.title ?? `intro-${index}`}
            className={section.title ? "section-card" : ""}
          >
            {section.title && (
              <h2 className="mb-4 text-xl font-semibold text-pcv-burgundy">
                {section.title}
              </h2>
            )}
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {section.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </article>
    </div>
  );
}
