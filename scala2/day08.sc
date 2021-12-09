case class Line(ps:Patterns, os:Outputs)

type Pattern = String
type Patterns = Array[Pattern]
type Output = String
type Outputs = Array[Output]

def readFile (file:String) = {
    val fileLines = scala.io.Source.fromFile(file).getLines.filter(_.nonEmpty);

    val inputs = fileLines.map(_.split('|'))
    val lines = inputs.map(l=>Line(l(0).split(' '), l(1).split(' ')))

    lines
}

val lines = readFile("day08-example.txt");

for (l<-lines) println(l)